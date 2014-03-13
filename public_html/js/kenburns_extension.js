/*
 Ken Burns effect JQuery plugin
 Added "Start", "Pause", "Next", Previous", and Status Bar functions
 Copyright (C) 2014 Enrico Maria Caruso http://www.xbrowser.altervista.it
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var previousDataSlide = new Date().getTime();
var slideDrag = false;

$.fn.kenburns_extension = function() {

    for (var i = 0; i < 9999; i++) {
        clearInterval(i);
    }

    var args = arguments[0] || {};
    var arrayTime = [];
    var images = args.images;
    for (var i = 0; i < images.length; i++) {
        if (images[i] != null)
            arrayTime.push(parseInt(images[i]["display_time"]));
    }
    var html = document.createElement("div");

    var canvas = document.createElement("canvas");
    $(canvas).attr("id", "canvas").attr("width", args.width).attr("height", args.height);
    $(canvas).append("<p>Your browser does not support canvas!</p>");

    //Status bar
    if (args.status_bar === true) {
        var sliderDiv = document.createElement("div");
        $(sliderDiv).attr("class", "sliderDiv");
    }

    //**************************************************************
    var loaderDiv = document.createElement("div");
    $(loaderDiv).html("Your browser do not support HTML 5 standard");
    var caption = document.createElement("div");
    $(caption).attr("class", "slider-wrapper");
    var slides = "";
    for (var i = 0; i < args.images.length; i++) {
        if (images[i] != null)
            slides += '<div class="slide">' + args.images[i]["caption"] + '</div>';
    }
    $(caption).html(slides);
    //**************************************************************

    var containerForCanvasLoaderSlider = document.createElement("div");
    $(containerForCanvasLoaderSlider).append(canvas);
    $(containerForCanvasLoaderSlider).append(loaderDiv);
    var sliderPosition = document.createElement("div");
    $(containerForCanvasLoaderSlider).append(sliderPosition);

    //apply events to containerForCanvasLoaderSlider
    $(containerForCanvasLoaderSlider).mouseenter(function() {
        $(sliderPosition).append(sliderDiv);
        $(sliderPosition).append(divForSlide);
        $(sliderDiv).fadeIn("slow");
        $(slideShowController).fadeIn("slow");
    }).mouseleave(function() {
        $(sliderDiv).fadeOut("slow");
        $(slideShowController).fadeOut("slow");
    });

    $(html).append(containerForCanvasLoaderSlider);
    $(html).append(caption);
    //***********************************

    $(this).append(html);

    var pauseButton = document.createElement("a");
    var list = initAudio(args, this);

    var myplayList = list[0];
    var playListBackground = list[1];
    var background_duration = list[2];

    var slider = initSliders(args, caption, sliderDiv, arrayTime);
    var ken = startAnimation(args, sliderDiv, canvas, slider, myplayList, playListBackground, background_duration);

    $(sliderDiv).on('slideEnd', function(event) { //slideEnd
        slideMove(sliderDiv, pauseButton, ken, arrayTime, playListBackground, background_duration);
    }).on('slideStart', function(event) {
        slideDrag = true;
    }).on('mousedown', function(event) {
        slideMove(sliderDiv, pauseButton, ken, arrayTime, playListBackground, background_duration);
    });

    if (args.slide_controller === true) {
        // SLIDE SHOW CONTROLLER
        var divForSlide = document.createElement("div");
        var slideShowController = document.createElement("div");
        $(slideShowController).attr("class", "slideshow-controller");
        $(divForSlide).append(slideShowController);
        $(divForSlide).attr("style", "width: " + args.width + "px; height:" + args.height + "px; margin-top:-" + args.height + "px;");

        //slide controller buttons
        var ul = document.createElement("ul");
        $(ul).attr("role", "menu");
        $(slideShowController).append(ul);

        var li0 = document.createElement("li");
        $(li0).attr("class", "first");
        $(ul).append(li0);
        var firstButton = document.createElement("a");
        $(li0).append(firstButton);

        var li1 = document.createElement("li");
        $(li1).attr("class", "prev");
        $(ul).append(li1);
        var prevButton = document.createElement("a");
        $(li1).append(prevButton);

        var li2 = document.createElement("li");
        $(ul).append(li2);
        if (args.autoplay) {
            $(li2).attr("class", "pause");
        } else {
            $(li2).attr("class", "play");
        }
        $(li2).append(pauseButton);

        var li3 = document.createElement("li");
        $(li3).attr("class", "next");
        $(ul).append(li3);
        var nextButton = document.createElement("a");
        $(li3).append(nextButton);

        var li4 = document.createElement("li");
        $(li4).attr("class", "last");
        $(ul).append(li4);
        var lastButton = document.createElement("a");
        $(li4).append(lastButton);

        $(pauseButton).click(function() {
            if ($(this).parent().attr("class") === "pause") {
                $(this).parent().attr("class", "play");
                ken.pause();
                playListBackground.pause();
                myplayList.pause();

            } else {
                $(this).parent().attr("class", "pause");
                ken.play();
                playListBackground.play();
                myplayList.play();
            }
            return false;
        });

        $(firstButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            playListBackground.play(0);
            ken.setUpdateTime(0);
            myplayList.play(0);
            return false;
        });

        $(lastButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            var slidenumber = arrayTime.length - 1;
            var current_time = getRealTime(slidenumber, arrayTime);

            //**** BACKGROUND**************
            changePositionBackground(current_time, playListBackground, background_duration);
            //*****************************

            myplayList.play(-1);
            ken.setUpdateTime(current_time);
            return false;
        });

        var previousData = new Date().getTime();
        $(prevButton).click(function() {
            var actuallyData = new Date().getTime();
            if ((actuallyData - previousData) > 1000) {
                $(pauseButton).parent().attr("class", "pause");
                var indexGeneral = ken.getSlideNumber();
                if (indexGeneral !== 0)
                    indexGeneral = indexGeneral - 1;
                else
                    indexGeneral = arrayTime.length - 1;

                var current_time = getRealTime(indexGeneral, arrayTime);
                ken.setUpdateTime(current_time);
                previousData = new Date().getTime();
                //**** BACKGROUND**************
                changePositionBackground(current_time, playListBackground, background_duration);
                //*****************************
            }
            return false;
        });

        $(nextButton).click(function() {
            var actuallyData = new Date().getTime();
            if ((actuallyData - previousData) > 1000) {
                $(pauseButton).parent().attr("class", "pause");
                var indexGeneral = (ken.getSlideNumber() + 1) % arrayTime.length;
                var current_time = getRealTime(indexGeneral, arrayTime);
                //**** BACKGROUND**************
                changePositionBackground(current_time, playListBackground, background_duration);
                //*****************************
                ken.setUpdateTime(current_time);
                previousData = new Date().getTime();
            }
            return false;
        });
        //*********************************
    }
    $(loaderDiv).hide();


};

function changePositionBackground(current_time, playListBackground, background_duration) {
    //**** BACKGROUND**************
    var ret = getPosition(current_time, background_duration);
    var position = ret[0];
    var offsetForNextOrPrev = ret[1];

    playListBackground.play(position);
    $("#jquery_jplayer_background_playlist").jPlayer("play", parseInt(offsetForNextOrPrev) / 1000);
    //*****************************
}

function getPosition(current_time, background_duration) {
    var positionBackground = 0;
    var subTotal = 0;
    var offset = 0;
    for (var i = 0; i < background_duration.length; i++) {
        if (background_duration[i] != null) {
            offset += (i !== 0) ? background_duration[i - 1] : "";
            subTotal += background_duration[i];
            if (current_time <= subTotal) {
                positionBackground = i;
                break;
            }
        }
    }
    var offset = current_time - offset;
    return [positionBackground, offset];
}


function initSliders(args, caption, sliderDiv, arrayTime) {
    var maxTime = 0;
    for (var i = 0; i < arrayTime.length; i++) {
        if (arrayTime[i] != null) {
            maxTime += arrayTime[i];
        }
    }

    if (args.status_bar === true) {
        $(sliderDiv).jqxSlider({
            width: args.width,
            min: 0,
            max: maxTime,
            value: 0,
            step: 1000,
            showTicks: false,
            showButtons: false
        });
    }

    var slider = $(caption).bxSlider({
        controls: false,
        speed: 1000,
        auto: true,
        autoStart: false,
        adaptiveHeight: true,
        pager: false,
        mode: 'fade'
//        pause: 6000
    });
    return slider;
}


function getStartTime(realtime, arrayTime) {
    var value = 0;
    for (var i = 0; i < arrayTime.length; i++) {
        if (arrayTime[i] != null) {
            value += arrayTime[i];
            if (value >= realtime) {
                return value - arrayTime[i];
                break;
            }
        }
    }
    return false;
}

function getRealTime(indexPosition, arrayTime) {
    var position = 0;
    for (var i = 0; i < indexPosition; i++) {
        position += arrayTime[i];
    }
    return position;
}

function getAudioBackground(indexPosition, arrayTime) {
    var position = 0;
    for (var i = 0; i < indexPosition; i++) {
        position += arrayTime[i];
    }
    return position;
}

function slideMove(sliderDiv, pauseButton, ken, arrayTime, playListBackground, background_duration) {
    var actuallyDataSlide = new Date().getTime();
    if ((actuallyDataSlide - previousDataSlide) > 1000) {
        $(pauseButton).parent().attr("class", "pause");
        var currentTime = parseInt($(sliderDiv).jqxSlider('value'));

        //**** BACKGROUND**************
        changePositionBackground(currentTime, playListBackground, background_duration);
        //*****************************

        ken.setUpdateTime(getStartTime(currentTime, arrayTime), arrayTime);
        slideDrag = false;
        previousDataSlide = new Date().getTime();
    }
    return false;
}
function initAudio(args, main) {
    var background_duration = [];
    //****************** AUDIO TRACE *********************
    var audioArray_background = args.audio_background;
    var toJPlayerList_background = [];
    for (var i = 0; i < audioArray_background.length; i++) {
        if (audioArray_background[i] != null) {
            var ogg = audioArray_background[i]["mp3"].replace(".mp3", ".ogg");
            toJPlayerList_background.push({
                mp3: audioArray_background[i]["mp3"],
                oga: ogg
            });

            var duration = audioArray_background[i]["duration"];
            duration = ((parseInt(duration.split(":")[0]) * 60) + parseInt(duration.split(":")[1])) * 1000;
            background_duration.push(duration);
        }
    }

    //****************************************************
    var jplayerDiv_background = document.createElement("div");
    $(jplayerDiv_background).attr("id", "jquery_jplayer_background_playlist").attr("class", "jp-jplayer");
    var source_background = document.createElement("div");
    $(source_background).attr("id", "jp_container_background_playlist").attr("class", "jp-audio").attr("style", "visibility: hidden;");
    $(source_background).html('<div class="jp-type-playlist" style="display: none; height: 0px; width: 0px;">\n\
                                    <div class="jp-playlist">\n\
                                        <ol>\n\
                                            <li></li>\n\
                                        </ol>\n\
                                    </div>\n\
                               </div>');
    $(main).append(jplayerDiv_background);
    $(main).append(source_background);
    var myplayList_background = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_background_playlist",
        cssSelectorAncestor: "#jp_container_background_playlist"
    }, toJPlayerList_background, {
        wmode: "window",
        solution: "flash, html",
        supplied: "mp3,oga",
        smoothPlayBar: true,
        keyEnabled: true,
        audioFullScreen: true,
//        preload: "auto",
        volume: 0.2
    });
    $("#jquery_jplayer_background_playlist").unbind($.jPlayer.event.play);
    //****************************************************

    /*
     #!/bin/bash
     #for file in *.mp3
     #    do avconv -i "${file}" "`echo ${file%.mp3}.ogg`";
     #done
     */

    //*** AUDIO TRACE ************************************
    var audioArray = args.audio_for_images;
    var toJPlayerList = [];
    for (var i = 0; i < audioArray.length; i++) {
        if (audioArray[i] != null) {
            var ogg = audioArray[i]["mp3"].replace(".mp3", ".ogg");
            toJPlayerList.push({
                mp3: audioArray[i]["mp3"],
                oga: ogg
            });
        }
    }
    //****************************************************
    var jplayerDiv = document.createElement("div");
    $(jplayerDiv).attr("id", "jquery_jplayer_playlist").attr("class", "jp-jplayer");
    var source = document.createElement("div");
    $(source).attr("id", "jp_container_playlist").attr("class", "jp-audio").attr("style", "visibility: hidden;");
    $(source).html('<div class="jp-type-playlist" style="display: none; height: 0px; width: 0px;">\n\
                        <div class="jp-playlist">\n\
                            <ol>\n\
                                <li></li>\n\
                            </ol>\n\
                        </div>\n\
                    </div>');
    $(main).append(jplayerDiv);
    $(main).append(source);

    var myplayList = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_playlist",
        cssSelectorAncestor: "#jp_container_playlist"
    }, toJPlayerList, {
        wmode: "window",
        solution: "flash, html",
        supplied: "mp3, oga",
        smoothPlayBar: true,
        keyEnabled: true,
        audioFullScreen: true,
        volume: 1,
        ended: function(event) {
            $(this).jPlayer("stop");
            return false;
        }
    });
    $("#jquery_jplayer_playlist").unbind($.jPlayer.event.play);
    //****************************************************

    return [myplayList, myplayList_background, background_duration];
}

function startAnimation(args, sliderDiv, canvas, slider, myplayList, playListBackground, background_duration) {
    var background_track = 0;

    var ken = $(canvas).kenburns({
        debug: args.debug,
        images: args.images,
        display_times: args.display_times,
        zoom: args.zoom,
        frames_per_second: args.frames_per_second,
        fade_time: args.fade_time,
        background_color: args.background_color,
        pan: args.pan,
        autoplay: args.autoplay,
        post_render_callback: function($canvas, context) {
            if (args.status_bar === true && slideDrag === false) {
                $(sliderDiv).jqxSlider('setValue', ken.getUpdateTime());
            }

            var ret = getPosition(ken.getUpdateTime(), background_duration);
            if (ret[0] !== background_track) {
                background_track = ret[0];
                playListBackground.play(ret[0]);
                $("#jquery_jplayer_background_playlist").jPlayer("play", parseInt(ret[1]) / 1000);
            }

            // Called after the effect is rendered
            // Draw anything you like on to of the canvas
//            return;

            context.save();
            //var gradient = context.createLinearGradient(0, 0, 0, 60);  
            //gradient.addColorStop(0.0, '#000');
            //gradient.addColorStop(1.0, 'rgba(0,0,0,0)');
            //context.fillStyle = gradient;
            //context.fillRect(0, 0, context.canvas.width, 60);

            //var drawing = new Image();
            //drawing.src = "img/shadow.png";
            //context.drawImage(drawing,0,0);
//
            context.fillStyle = '#000';
            context.font = 'bold 20px serif';
            var width = $canvas.width();
            var height = $canvas.height();
            var text = "";
            var metric = context.measureText(text);

            context.fillStyle = '#fff';

            context.shadowOffsetX = 3;
            context.shadowOffsetY = 3;
            context.shadowBlur = 4;
            context.shadowColor = 'rgba(0, 0, 0, 0.8)';

            context.fillText(text, width - metric.width - 8, height - 8);
            context.restore();
        },
        post_display_image_callback: function(slide_number) {
            slider.goToSlide(slide_number);
            if (slide_number === 0) {
                console.log("PASSA");
                setTimeout(function() {
                    playListBackground.play(0);
                }, 100);
            }
//            indexGeneral = slide_number;
            //it's usefull to set audio for more than one slide
            if (myplayList.playlist[slide_number]["mp3"] !== "" && myplayList.playlist[slide_number]["mp3"] !== null) {
                myplayList.play(slide_number);
//                console.log("-- Play: " + slide_number);
            }
        }
    });

    return ken;
}

//
//function fadeIn(audio) {
//    audio.volume = 1;
//    audio.play();
//
////    var isSeeking = audio.seeking;
////    var isSeekable = audio.seekable && audio.seekable.length > 0;
////    console.log("---");
////    console.log("Duration: " + audio.duration);
////    console.log("isSeeking: " + isSeeking);
////    console.log("isSeekable: " + isSeekable);
////    console.log("---");
//
////    var vol = 0;
////    var interval = 200;
////    var intervalID = setInterval(function() {
////        if (vol < 1) {
////            vol += 0.1;
////            if (vol >= 0 && vol <= 1)
////                audio.volume = vol;
////        } else {
////            clearInterval(intervalID);
////        }
////    }, interval);
//}

function fadeOut(audioPrecedente) {
    var vol = 0.1;
    var interval = 200;
    var intervalID = setInterval(function() {
        if (vol >= 0.1) {
            vol -= 0.1;
            if (vol >= 0 && vol <= 1)
                audioPrecedente.volume = vol;
        } else {
            audioPrecedente.pause();
            clearInterval(intervalID);
        }
    }, interval);
}
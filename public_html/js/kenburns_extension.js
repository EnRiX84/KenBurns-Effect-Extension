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
var background_duration = [];
var current_slide = 0;
var bxSlider;

$.fn.kenburns_extension = function() {
    for (var i = 0; i < 9999; i++) {
        clearInterval(i);
    }

    var args = arguments[0] || {};

    var html = document.createElement("div");

    var canvas = document.createElement("canvas");
    $(canvas).attr("id", "canvas").attr("width", args.width).attr("height", args.height);
    $(canvas).append("<p>Your browser does not support canvas!</p>");

    //Status bar
    if (args.status_bar === true) {
        var statusBar = document.createElement("div");
        $(statusBar).attr("class", "statusBar");
    }

    var loaderDiv = document.createElement("div");
    $(loaderDiv).html("Your browser do not support HTML 5 standard");
    var caption = document.createElement("div");
//    $(caption).attr("class", "slider-wrapper");

    var containerForCanvasLoaderSlider = document.createElement("div");
    $(containerForCanvasLoaderSlider).append(canvas);
    $(containerForCanvasLoaderSlider).append(loaderDiv);
    var sliderPosition = document.createElement("div");
    $(containerForCanvasLoaderSlider).append(sliderPosition);
    $(html).append(containerForCanvasLoaderSlider);
    $(html).append(caption);

    var maxTime = 0;
    var arrayTime = [];
    var images = args.images;
    for (var i = 0; i < images.length; i++) {
        if (images[i] !== null) {
            maxTime += parseInt(images[i]["display_time"]);
            arrayTime.push(parseInt(images[i]["display_time"]));

            var div = document.createElement("div");
            $(div).attr("class", "slide");
            $(div).html(args.images[i]["caption"]);
            $(caption).append(div);
        }
    }

    //***********************************
    $(this).append(html);

    var pauseButton = document.createElement("a");

    initSliders(args, caption, statusBar, maxTime);
    var ken = startAnimation(args, statusBar, canvas);
    initAudio(args, this, ken);

    //apply events to containerForCanvasLoaderSlider
    $(containerForCanvasLoaderSlider).mouseenter(function() {
        $(sliderPosition).append(statusBar);
        $(sliderPosition).append(divForSlide);
        $(statusBar).fadeIn();
        $(slideShowController).fadeIn();
    }).mouseleave(function() {
        $(statusBar).fadeOut();
        $(slideShowController).fadeOut();
    });

    $(statusBar).on('slideEnd', function(event) { //slideEnd
        slideMove(this, slideShowController, pauseButton, ken, arrayTime);
    }).on('slideStart', function(event) {
        slideDrag = true;
    }).on('mousedown', function(event) {
        slideMove(this, slideShowController, pauseButton, ken, arrayTime);
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

        $(pauseButton).mousedown(function() {
            if ($(this).parent().attr("class") === "pause") {
                var actuallyDataSlide = new Date().getTime();
                if ((actuallyDataSlide - previousDataSlide) > 1000) {
                    $(this).parent().attr("class", "play");
                    $f("idplayer").pause();
                    $f("idplayertrace").pause();
                    ken.pause();
                }
            } else {
                $(this).parent().attr("class", "pause");
                $f("idplayer").play();
                if ($f("idplayertrace").getClip().index == ken.getSlideNumber())
                    $f("idplayertrace").play();
                ken.play();
            }
            return false;
        });

        $(firstButton).mousedown(function() {
            $(pauseButton).parent().attr("class", "pause");
            ken.setUpdateTime(0);
            return false;
        });

        $(lastButton).mousedown(function() {
            $(pauseButton).parent().attr("class", "pause");
            var slidenumber = arrayTime.length - 1;
            var current_time = getRealTime(slidenumber, arrayTime);

            //**** BACKGROUND**************
            changePositionBackground(current_time);
            //*****************************
            ken.setUpdateTime(current_time);
            return false;
        });

        var previousData = new Date().getTime();
        $(prevButton).mousedown(function() {
            var actuallyData = new Date().getTime();
            if ((actuallyData - previousData) > 1000) {
                $(pauseButton).parent().attr("class", "pause");
                var indexGeneral = ken.getSlideNumber();
                if (indexGeneral !== 0)
                    indexGeneral = indexGeneral - 1;
                else
                    indexGeneral = arrayTime.length - 1;
                var current_time = getRealTime(indexGeneral, arrayTime);
                //**** BACKGROUND**************
                changePositionBackground(current_time);
                //*****************************
                ken.setUpdateTime(current_time);
                previousData = new Date().getTime();
            }
            return false;
        });

        $(nextButton).mousedown(function() {
            var actuallyData = new Date().getTime();
            if ((actuallyData - previousData) > 1000) {
                $(pauseButton).parent().attr("class", "pause");
                var indexGeneral = (ken.getSlideNumber() + 1) % arrayTime.length;
                var current_time = getRealTime(indexGeneral, arrayTime);
                //**** BACKGROUND**************
                changePositionBackground(current_time);
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

function changePositionBackground(current_time) {
    //**** BACKGROUND**************
    var ret = getPosition(current_time);
    $f("idplayer").play(ret[0]);
    $f("idplayer").seek(parseInt(ret[1]) / 1000);
    //*****************************
}

function getPosition(current_time) {
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


function initSliders(args, caption, statusBar, maxTime) {
    bxSlider = $(caption).bxSlider({
        controls: false,
        speed: 800,
        auto: true,
        autoStart: false,
        adaptiveHeight: true,
        mode: 'fade',
        pager: false,
//        infiniteLoop: false,
//        hideControlOnEnd: true,

    });

    if (args.status_bar === true) {
        $(statusBar).jqxSlider({
            width: args.width,
            min: 0,
            max: maxTime,
            value: 0,
            step: 1000,
            showTicks: false,
            showButtons: false
        });
    }
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

function slideMove(statusBar, slideShowController, pauseButton, ken, arrayTime) {

    var actuallyDataSlide = new Date().getTime();
    if ((actuallyDataSlide - previousDataSlide) > 1000) {
        $(pauseButton).parent().attr("class", "pause");
        var currentTime = parseInt($(statusBar).jqxSlider('value'));
        //**** BACKGROUND**************
        changePositionBackground(currentTime);
        //*****************************
        ken.setUpdateTime(getStartTime(currentTime, arrayTime), arrayTime);
        slideDrag = false;
//        previousDataSlide = new Date().getTime();
    }
    return false;
}

function addFlowPlayer(panel, toJPlayerList_background, ken, args) {
    var jp_container = document.createElement("div");
    var pl_namePlayer = "idplayer";
    $(jp_container).attr("id", pl_namePlayer);
    $(jp_container).attr("style", "width: 600px; height:25px;");
    $(panel).append(jp_container);
//    $(function() {
    $f(pl_namePlayer, {src: "js/flowplayer-3.2.16.swf"}, {//, wmode: "transparent"
        playlist: toJPlayerList_background,
        onLoad: function() { // called when player has finished loading
            this.setVolume(20); // set volume property
        },
        clip: {
            autoPlay: false,
            autoBuffering: true,
            provider: "audio",
            onCuepoint: [-500, function(clip) {
                    var index = clip.index + 1;
                    var clip = $f(pl_namePlayer).getClip(index);
                    if (clip !== null && clip.url !== null) {
                        $f(pl_namePlayer).pause();
                        $f(pl_namePlayer).play(index);
                    }
                    return false;
                }],
        },
        plugins: {//controls:null
            controls: {
                playlist: true,
                autoHide: false,
                fullscreen: false,
                height: 30
            },
            audio: {
                url: "js/flowplayer.audio-3.2.10.swf"
            }
        }
    });
    return pl_namePlayer;
}

function addFlowPlayerTrace(panel, toJPlayerList, ken, args) {
    var jp_container = document.createElement("div");
    var pl_namePlayerTrace = "idplayertrace";
    $(jp_container).attr("id", pl_namePlayerTrace);
    $(jp_container).attr("style", "width: 600px; height:25px;");
    $(panel).append(jp_container);

//    $(function() {
    $f(pl_namePlayerTrace, {src: "js/flowplayer-3.2.16.swf"}, {//, wmode: "transparent"
        playlist: toJPlayerList,
        onLoad: function() { // called when player has finished loading
            this.setVolume(100); // set volume property
            if (args.autoplay) {
                if ($f("idplayer").isLoaded()) {
                    ken.play();
                    $f("idplayer").play(0);
                } else {
                    setTimeout(function() {
                        ken.play();
                        $f("idplayer").play(0);
                    }, 1000);
                }
            }
        },
        clip: {
            autoPlay: false,
            autoBuffering: true,
            provider: "audio",
            onStart: function(event) {
            }
        },
        plugins: {
            controls: {
                playlist: true,
                autoHide: false,
                fullscreen: false,
                height: 30
            },
            audio: {
                url: "js/flowplayer.audio-3.2.10.swf"
            }
        }
//        });
    });
}

function initAudio(args, main, ken) {
    //****************** AUDIO TRACE *********************
    var audioArray_background = args.audio_background;
    var toJPlayerList_background = [];
    for (var i = 0; i < audioArray_background.length; i++) {
        if (audioArray_background[i] !== null) {
            toJPlayerList_background.push({
                url: audioArray_background[i]["mp3"],
//                duration: parseInt(audioArray_background[i]["duration"]),
                position: parseInt(i),
                autoPlay: (i != 0) ? true : false
            });
            var duration = parseInt(audioArray_background[i]["duration"]) * 1000;
            background_duration.push(duration);
        }
    }
    addFlowPlayer(main, toJPlayerList_background, ken, args);

//    /*
//     #!/bin/bash
//     #for file in *.mp3
//     #    do avconv -i "${file}" "`echo ${file%.mp3}.ogg`";
//     #done
//     */

//    //*** AUDIO TRACE ************************************
    var audioArray = args.audio_for_images;
    var toJPlayerList = [];
    for (var i = 0; i < audioArray.length; i++) {
        if (audioArray[i] !== null) {
            toJPlayerList.push({
                url: audioArray[i]["mp3"],
                position: parseInt(i)
            });
        }
    }
    addFlowPlayerTrace(main, toJPlayerList, ken, args);
}

function startAnimation(args, statusBar, canvas) {
    var ken = $(canvas).kenburns({
        debug: args.debug,
        images: args.images,
        display_times: args.display_times,
        zoom: args.zoom,
        frames_per_second: args.frames_per_second,
        fade_time: args.fade_time,
        background_color: args.background_color,
        pan: args.pan,
        autoplay: false,
        post_render_callback: function($canvas, context, update_time) {
            if (args.status_bar === true && slideDrag === false) {
                $(statusBar).jqxSlider('setValue', parseInt(update_time));
            }
            return;
        },
        post_display_image_callback: function(slide_number) {

            previousDataSlide = new Date().getTime();
            bxSlider.goToSlide(parseInt(slide_number));

            if (slide_number === 0) {
                $f("idplayer").play(0);
            }

            //it's usefull to set audio for more than one slide
            var clip = $f("idplayertrace").getClip(slide_number);
            if (clip.url !== null) {
                $f("idplayertrace").play(slide_number);
            }
        }
    });
    return ken;
}

function timeToSecond(time) {
    if (time === 0) {
        return 0;
    }
    var timeSplit = time.split(":");
    return ((parseInt(timeSplit[0]) * 3600) + (parseInt(timeSplit[1]) * 60) + parseInt(timeSplit[2]));
}

function secondToTime(second) {
    var seconds = Math.floor(second), hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
}
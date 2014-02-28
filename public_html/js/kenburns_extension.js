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

var slider;
var sliderDiv;
var caption;
var canvas;
var ken;
var pauseButton;

var indexGeneral = 0;
var arrayTime = [];
var slideDrag = false;

$.fn.kenburns_extension = function() {

    var args = arguments[0] || {};

    var images = args.images;
    for (var i = 0; i < images.length; i++) {
        arrayTime.push(images[i].display_time);
    }

    var html = document.createElement("div");

    canvas = document.createElement("canvas");
    $(canvas).attr("id", "canvas").attr("width", args.width).attr("height", args.height);
    $(canvas).append("<p>Your browser does not support canvas!</p>");

    //Status bar
    if (args.status_bar == true) {
        sliderDiv = document.createElement("div");
        $(sliderDiv).attr("class", "sliderDiv");
    }

    //CAPTIONS
    var loaderDiv = document.createElement("div");
    $(loaderDiv).html("Your browser do not support HTML 5 standard");
    caption = document.createElement("div");
    $(caption).attr("class", "slider-wrapper");
    var slides = "";
    for (var i = 0; i < args.images.length; i++) {
        slides += '<div class="slide">' + args.images[i].caption + '</div>';
    }
    $(caption).html(slides);

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

    if (args.slide_controller == true) {
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
        $(li2).attr("class", "pause");
        $(ul).append(li2);
        pauseButton = document.createElement("a");
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
            if ($(this).parent().attr("class") == "pause") {
                $(this).parent().attr("class", "play");
                ken.pause();
                $(".background")[0].pause();
                myplayList.pause();
            } else {
                $(this).parent().attr("class", "pause");
                ken.play();
                $(".background")[0].play();
                myplayList.play();
            }
        });

        $(firstButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            myplayList.play(0);
            $(".background")[0].currentTime = 0;
            ken.setUpdateTime(0);
        });

        $(lastButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            var slidenumber = arrayTime.length - 1;
            myplayList.play(-1);
            var current_time = getRealTime(slidenumber);
            $(".background")[0].currentTime = (current_time / 1000) % $(".background")[0].duration;
            ken.setUpdateTime(current_time);
        });

        $(prevButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            if (indexGeneral != 0)
                indexGeneral = indexGeneral - 1;
            else
                indexGeneral = arrayTime.length - 1;

            myplayList.previous();
            var current_time = getRealTime(indexGeneral);
            $(".background")[0].currentTime = (current_time / 1000) % $(".background")[0].duration;
            ken.setUpdateTime(current_time);
        });

        $(nextButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            indexGeneral = (indexGeneral + 1) % arrayTime.length;
            var current_time = getRealTime(indexGeneral);
            $(".background")[0].currentTime = (current_time / 1000) % $(".background")[0].duration;
            ken.setUpdateTime(current_time);
            myplayList.next();
        });
        //*********************************
    }

    $(this).append(html);

    initSliders(args);
    initAudio(args, this);
    $(loaderDiv).hide();
    startAnimation(args);
};

function getStartTime(realtime) {
    var value = 0;
    for (var i = 0; i < arrayTime.length; i++) {
        value += arrayTime[i];
        if (value >= realtime) {
            return value - arrayTime[i];
            break;
        }
    }
    return false;
}

function getRealTime(indexPosition) {
    var position = 0;
    for (var i = 0; i < indexPosition; i++) {
        position += arrayTime[i];
    }
    return position;
}

function initSliders(args) {
    var maxTime = 0;
    for (var i = 0; i < arrayTime.length; i++) {
        maxTime += arrayTime[i];
    }

    if (args.status_bar == true) {
        $(sliderDiv).jqxSlider({
            width: args.width,
            min: 0,
            max: maxTime,
            value: 0,
            step: 1000,
            showTicks: false,
            showButtons: false,
//            ticksFrequency: 5000,
//            ticksPosition: 'bottom',
//            mode: 'fixed',
        }).on('slideEnd', function(event) { //slideEnd
            slideMove();
        }).on('slideStart', function(event) {
            slideDrag = true;
        }).on('mousedown', function(event) {
            slideMove();
        });
    }

    slider = $(caption).bxSlider({
        controls: false,
        speed: 1000,
        auto: true,
        autoStart: false,
        adaptiveHeight: true,
        pager: false,
        mode: 'fade'
//        pause: 6000
    });
}

function slideMove() {
    $(pauseButton).parent().attr("class", "pause");
    var time = parseInt($(sliderDiv).jqxSlider('value'));
//    $(".background")[0].currentTime = (time / 1000) % $(".background")[0].duration;
    ken.setUpdateTime(getStartTime(time));
    slideDrag = false;
}
var myplayList;
function initAudio(args, main) {

    //****AUDIO BACKGROUND********************************
    var audio_background_element = args.audio_background[0];
    if (audio_background_element != null && audio_background_element.src_ogg != null
            && audio_background_element.src_mp3 != null) {
        var audio_background = document.createElement("audio");
        $(audio_background).attr("preload", "auto").attr("autobuffer", true).attr("class", "background");
        if (audio_background_element.autoplay != null && audio_background_element.autoplay == true) {
            $(audio_background).attr("autoplay", true).attr("loop", true);
        }
        var source_background = document.createElement("source");
        $(source_background).attr("src", audio_background_element.src_ogg).attr("type", "audio/ogg");
        var source_background2 = document.createElement("source");
        $(source_background2).attr("src", audio_background_element.src_mp3).attr("type", "audio/mpeg");
        $(audio_background).append(source_background);
        $(audio_background).append(source_background2);
        $(main).append(audio_background);
        audio_background.volume = 0.2;
    }
    //****************************************************

//
//    var jplayerBackground = document.createElement("div");
//    $(jplayerBackground).attr("id", "jplayerBackground").attr("class", "jp-jplayer");
//
//    var jplayerDiv = document.createElement("div");
//    $(jplayerDiv).attr("id", "jquery_jplayer_1").attr("class", "jp-jplayer");
//    var source = document.createElement("div");
//    $(source).attr("id", "jp_container_1").attr("class", "jp-audio");
//    $(source).html('<div class="jp-type-playlist"  style="display: none; height: 0px; width: 0px;"><div class="jp-playlist"><ol><li></li></ol></div></div>');
//    $(main).append(jplayerDiv);
//    $(main).append(source);

//
//    myplayList = new jPlayerPlaylist({
//        jPlayer: "#jquery_jplayer_1",
//        cssSelectorAncestor: "#jp_container_1"
//    }, toJPlayerList, {
//        swfPath: "js/",
//        supplied: "oga,mp3",
//        wmode: "window",
//        solution: "flash, html",
//        ready: function() {
////            $(this).jPlayer("play");
//        },
//        ended: function(event) {
////            $(this).jPlayer("play");
//        }
//    });


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
        toJPlayerList.push({
            mp3: audioArray[i].src_mp3,
        })
    }
    //****************************************************
    var jplayerDiv = document.createElement("div");
    $(jplayerDiv).attr("id", "jquery_jplayer_1").attr("class", "jp-jplayer");
    var source = document.createElement("div");
    $(source).attr("id", "jp_container_1").attr("class", "jp-audio");
    $(source).html('<div class="jp-type-playlist"  style="display: none; height: 0px; width: 0px;"><div class="jp-playlist"><ol><li></li></ol></div></div>');
    $(main).append(jplayerDiv);
    $(main).append(source);

    myplayList = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    }, toJPlayerList, {
        swfPath: "js/",
        supplied: "oga,mp3",
        wmode: "window",
        solution: "flash, html",
        ready: function() {
//            $(this).jPlayer("play");
        },
        ended: function(event) {
//            $(this).jPlayer("play");
        }
    });
}

function startAnimation(args) {
    ken = $(canvas).kenburns({
        debug: args.debug,
        images: args.images,
        display_times: args.display_times,
        zoom: args.zoom,
        frames_per_second: args.frames_per_second,
        fade_time: args.fade_time,
        background_color: args.background_color,
        pan: args.pan,
        post_render_callback: function($canvas, context) {
            if (args.status_bar == true && slideDrag == false) {
                $(sliderDiv).jqxSlider('setValue', ken.getUpdateTime());
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
//            setTimeout(function() {
            indexGeneral = slide_number;
            slider.goToSlide(slide_number);
            playAudio(slide_number);
//            }, 10);
        }
    });
}

function playAudio(slideNumber) {
    myplayList.play(slideNumber);
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
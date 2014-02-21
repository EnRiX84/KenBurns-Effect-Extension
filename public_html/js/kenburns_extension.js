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
var arrayTime = [0, 5000, 10000, 15000, 20000];

$.fn.kenburns_extension = function() {

    var args = arguments[0] || {};

    var html = document.createElement("div");

    canvas = document.createElement("canvas");
    $(canvas).attr("id", "canvas").attr("width", args.width).attr("height", args.height);
    $(canvas).append("<p>Your browser does not support canvas!</p>");

    var inside = false;

    //Status bar
    if (args.status_bar == true) {
        sliderDiv = document.createElement("div");
        $(sliderDiv).attr("class", "sliderDiv");
        $(sliderDiv).mouseover(function() {
            inside = true;
        }).mouseout(function() {
            inside = false;
        });
    }
    //*******************

    //apply events to canvas
    $(canvas).mousemove(function() {
        $(html).append(sliderDiv);
        $(html).append(divForSlide);
        $(sliderDiv).fadeIn("slow");
        $(slideShowController).fadeIn("slow");
    }).mouseout(function() {
        setTimeout(function() {
            if (inside == false) {
                $(sliderDiv).fadeOut("slow");
                $(slideShowController).fadeOut("slow");
            }
        }, 10);
    });

    //CAPTIONS
    var loaderDiv = document.createElement("div");
    caption = document.createElement("div");
    var slides = "";
    for (var i = 0; i < 10; i++) {
        slides += '<div class="slide">Testo ' + i + '</div>';
    }
    $(caption).html(slides);
    $(html).append(canvas);
    $(html).append(loaderDiv);
    $(html).append(caption);
    //***********************************

//    <div id="Slideshow-1392891124688" class="slideshow-captions" aria-busy="false" aria-hidden="false" role="description" style="height: 22px; visibility: visible; opacity: 0.7;">2 seconda descrizione</div>

    if (args.slide_controller == true) {
        // SLIDE SHOW CONTROLLER
        var divForSlide = document.createElement("div");
        var slideShowController = document.createElement("div");
        $(slideShowController).attr("class", "slideshow-controller");
        $(divForSlide).append(slideShowController);
        $(divForSlide).attr("style", "width: " + args.width + "px; height:" + args.height + "px; margin-top:-" + args.height + "px;");

        $(slideShowController).mouseover(function() {
            inside = true;
        }).mouseout(function() {
            inside = false;
        });

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
                $(".speech")[indexGeneral].pause();
            } else {
                $(this).parent().attr("class", "pause");
                ken.play();
                $(".background")[0].play();
                $(".speech")[indexGeneral].play();
            }
        });

        $(firstButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            var speech = $(".speech")[indexGeneral];
            if (indexGeneral == 0) {
                speech.load();
                fadeIn(speech);
            } else {
                speech.pause();
            }
            ken.setUpdateTime(0);
        });

        $(lastButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            var speech = $(".speech")[indexGeneral];
            if (indexGeneral == (arrayTime.length - 1)) {
                speech.load();
                fadeIn(speech);
            } else {
                speech.pause();
            }
            ken.setUpdateTime(20000);
        });

        $(prevButton).click(function() {
            $(pauseButton).parent().attr("class", "pause");
            $(".speech")[indexGeneral].pause();
            if (indexGeneral != 0)
                indexGeneral = (indexGeneral - 1) % arrayTime.length;
            else
                indexGeneral = arrayTime.length - 1;
            ken.setUpdateTime(arrayTime[indexGeneral]);
        });
        $(nextButton).click(function() {
            $(".speech")[indexGeneral].pause();
            $(pauseButton).parent().attr("class", "pause");
            indexGeneral = (indexGeneral + 1) % arrayTime.length;
            ken.setUpdateTime(arrayTime[indexGeneral]);
        });
        //*********************************
    }

    $(this).append(html);

    initSliders(args);
    initAudio(args, this);
    $(loaderDiv).hide();
    startAnimation(args);

};

function initSliders(args) {
    if (args.status_bar == true) {
        $(sliderDiv).jqxSlider({
            width: args.width,
            min: 0,
            max: 25000,
            ticksFrequency: 5000,
            value: 0,
            step: 5000,
            showButtons: false,
            ticksPosition: 'bottom',
        }).on('slideEnd', function(event) {
            $(pauseButton).parent().attr("class", "pause");
            var time = parseInt($(this).jqxSlider('value'));
            ken.setUpdateTime(time);
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

function initAudio(args, main) {

    //****AUDIO BACKGROUND********************************
    var audio_background_element = args.audio_background[0];

    if (audio_background_element.src_ogg == null || audio_background_element.src_mp3 == null) {
        alert("Insert correct information to load audio");
        return;
    }

    var audio_background = document.createElement("audio");
    $(audio_background).attr("preload", true).attr("class", "background");
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
    audio_background.volume = 0;
    //****************************************************

    //*** AUDIO TRACE ************************************
    var audioArray = args.audio_for_images;
    for (var i = 0; i < audioArray.length; i++) {
        var audio = document.createElement("audio");
        $(audio).attr("preload", true).attr("class", "speech");
        if (audioArray[i].src_ogg == null || audioArray[i].src_mp3 == null) {
            alert("Insert correct information to load audio");
            return;
        }
        var source = document.createElement("source");
        $(source).attr("src", audioArray[i].src_ogg).attr("type", "audio/ogg");
        var source2 = document.createElement("source");
        $(source2).attr("src", audioArray[i].src_mp3).attr("type", "audio/mpeg");
        $(audio).append(source);
        $(audio).append(source2);
        $(main).append(audio);
    }
    //****************************************************
}

function startAnimation(args) {
    ken = $(canvas).kenburns({
        debug: args.debug,
        images: args.images,
        display_times: args.display_times,
        frames_per_second: args.frames_per_second,
        fade_time: args.fade_time,
        background_color: args.background_color,
        zoom: args.zoom,
        pan: args.pan,
        post_render_callback: function($canvas, context) {
            if (args.status_bar == true) {
                $(sliderDiv).jqxSlider('setValue', ken.getUpdateTime());
            }
            // Called after the effect is rendered
            // Draw anything you like on to of the canvas
            return;

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
//            }, 0);
        }
    });
}

function playAudio(slideNumber) {
    var index = (slideNumber != 0) ? (slideNumber - 1) : arrayTime.length - 1;

    console.log("precedente: " + index);
    console.log("successiva: " + slideNumber);

    var audioAttuale = $('.speech')[slideNumber];
    audioAttuale.load();
    fadeIn(audioAttuale);

    var audioPrecedente = $('.speech')[index];
    fadeOut(audioPrecedente);

}


function fadeIn(audio) {
    audio.volume = 0;
    audio.play();
    var vol = 0;
    var interval = 200;
    var intervalID = setInterval(function() {
        if (vol < 1) {
            vol += 0.1;
            if (vol >= 0 && vol <= 1)
                audio.volume = vol;
        } else {
            clearInterval(intervalID);
        }
    }, interval);
}

function fadeOut(audioPrecedente) {
    console.log(audioPrecedente);
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
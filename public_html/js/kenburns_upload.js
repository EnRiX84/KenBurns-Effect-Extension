/*
 Upload form to create KenBurns Effects JQuery plugin
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



$.fn.kenburns_upload = function() {
    var indexAudioPlayer = 0;
    var args = arguments[0] || {};
    var html = document.createElement("div");
    $(html).html('\
            <div style="display: inline-block;">\n\
                <div id="audio_video">\n\
                    <div id="catalog">\n\
                        <h2><a href="#">Upload Images</a></h2>\n\
                        <div>\n\
                            <input id="fileuploadImage" type="file" name="files[]" data-url="server/php/" multiple><br/><br/>\n\
                            <div id="imageSection" style="height: 265px; overflow: auto;">\n\
                            </div>\n\
                        </div>\n\
                        <h2><a href="#">Upload Audio</a></h2>\n\
                        <div >\n\
                            <input id="fileuploadAudio" type="file" name="files[]" data-url="server/php/" multiple>\n\
                            <div id="audioSection" style="height: 265px; width: 450px; overflow: auto;">\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
                <div id="player" align="center"></div>\n\
            </div>\n\
            <div id="status_bar">\n\
                <h1 class="ui-widget-header" style="width: 860px;">Slides</h1><button class="createVideo">Play Video</button>\n\
                <div class="ui-widget-content">\n\
                    <ul style="height: 200px; overflow: auto;">\n\
                        <li class="placeholder">Drag your images here</li>\n\
                    </ul>\n\
                </div>\n\
            </div>');
    $(this).append(html);
    $("#catalog").accordion({});
//
//    $("#catalog li").draggable({
//        appendTo: "body",
//        helper: "clone"
//    });

    var dropped = 0;
    $("#status_bar ul").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper, .jplayer)",
        drop: function(event, ui) {
            dropped = dropped + 1;
            $(this).find(".placeholder").remove();
            var div = document.createElement("div");
            $(div).attr("id", "status_bar_id_" + dropped);
            $(div).attr("class", "status_bar_element");
            $(div).html("<div><div align='center' style='height: 50px;'>" + ui.draggable.html() + "</div>\n\
                        <span><b>Audio: </b></span><span class='audio' name='' style='width: 100px;'>...drag your audio here</span><br/>\n\
                        <span><b>Text: </b></span><textarea class='text' style='max-height: 50px; height: 15px; width: 130px; max-width: 170px;'></textarea><br/>\n\
                        <span><b>Time: </b></span><span class='time'><input type='text' value='1000' style='width: 50px;'/> milliseconds</span><br/>\n\
                        <span><b>Zoom: </b></span><span class='zoom'><input type='text' value='1' style='width: 30px;'/> units</span><br/>\n\
                        <span><b>Pan: </b></span><span class='text'>from <input class='panFrom' type='text' value='1' style='width: 30px;'/> to <input id='panTo'type='text' value='1' style='width: 30px;'/></span>\n\
                        <div id='delete" + dropped + "' align='center'><img style='cursor: pointer;' src='css/images/delete.png'/></div><br/></div>");
            $("<li></li>").html(div).appendTo(this);

            $("#delete" + dropped).click(function() {
                var r = confirm("Are you sure?");
                if (r == true) {
                    $(this).parent().parent().remove();
                }
                return false;
            });

            $(div).droppable({
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                accept: ".jplayer",
                drop: function(event, ui) {
                    var jplayer = ui.draggable;
                    var title = "";
                    var duration = "";
                    var src = "";
                    var audio;
                    $(this).find(".audio").each(function() {
                        audio = this;
                        return false;
                    });
                    $(jplayer).find(".jp-duration").each(function() {
                        duration = $(this).text();
                    });
                    $(jplayer).find(".jp-title").each(function() {
                        title = $(this).text();
                    });
                    $(jplayer).find("audio").each(function() {
                        src = $(this).attr("src");
                    });
                    $(audio).attr("name", src).html(title + " - " + duration);
                }
            });
        }
    }).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $(this).removeClass("ui-state-default");
        }
    });

    $(".createVideo").button().click(function(event) {
        event.preventDefault();
        generateVideo();
        return false;
    });

    //******************************** IMMAGINI DI TEST ********************************
    var span = document.createElement("span");
    $(span).attr("style", " padding: 5px; max-height: 50px; max-width: 50px;")
    var img = document.createElement("img");
    $(img).attr("src", "http://www.online-image-editor.com/styles/2013/images/example_image.png").attr("style", "max-height: 50px; max-width: 50px;");
    $(span).append(img);
    $(img).disableSelection();
    $("#imageSection").append(span);
    $(span).draggable({
        appendTo: "body",
        helper: "clone"
    });

    var span = document.createElement("span");
    $(span).attr("style", " padding: 5px; max-height: 50px; max-width: 50px;")
    var img = document.createElement("img");
    $(img).attr("src", "http://www.esa.int/var/esa/storage/images/esa_multimedia/images/2012/11/solar_eclipse_corona/12092636-3-eng-GB/Solar_eclipse_corona_node_full_image.jpg").attr("style", "max-height: 50px; max-width: 50px;");
    $(span).append(img);
    $(img).disableSelection();
    $("#imageSection").append(span);
    $(span).draggable({
        appendTo: "body",
        helper: "clone"
    });

    createAudioPlayer(10, "http://localhost/slider/audio/Oman_Speech_07.mp3");
    createAudioPlayer(15, "http://localhost/slider/audio/Oman_Speech_08.mp3");
    createAudioPlayer(20, "http://localhost/slider/audio/Oman_Speech_09.mp3");
    //*********************************************************************************

    $('#fileuploadImage').fileupload({
        dataType: 'json',
        done: function(e, data) {
            $.each(data.result.files, function(index, file) {
                if (endsWith(file.url, ".jpg") || endsWith(file.url, ".png") || endsWith(file.url, ".gif")) {
                    var span = document.createElement("span");
                    $(span).attr("style", " padding: 5px; max-height: 50px; max-width: 50px;")
                    var img = document.createElement("img");
                    $(img).attr("src", file.url).attr("style", "max-height: 50px; max-width: 50px;");
                    $(span).append(img);
                    $(img).disableSelection();
                    $("#imageSection").append(span);
                    $(span).draggable({
                        appendTo: "body",
                        helper: "clone"
                    });
                }
            });
        }
    });


    $('#fileuploadAudio').fileupload({
        dataType: 'json',
        done: function(e, data) {
            $.each(data.result.files, function(index, file) {
                if (endsWith(file.url, ".mp3")) {
                    indexAudioPlayer = indexAudioPlayer + 1;
                    createAudioPlayer(indexAudioPlayer, file.url);
                }
            });
        }
    });
};
var precedentPlay = new Date().getTime();
function generateVideo() {
    var actuallyDataSlide = new Date().getTime();
    if ((actuallyDataSlide - precedentPlay) > 2000) {
        var newPlayer = document.createElement("div");
//        $("#player").children().remove();
        $("#player").html("");
        $("#player").append(newPlayer);

        $(newPlayer).kenburns_extension({
            width: 450,
            height: 300,
            status_bar: true, //set if you want see the status bar
            slide_controller: true, //set if you want see the slide controller
            images: [//select path of your images
                {display_time: 5000, zoom: 1, src: './img/title_majesty.png', caption: 'testo 1 '}, // 1
                {display_time: 5000, zoom: 1, src: './img/title_university.png', caption: 'testo 2'}, // 2
                {display_time: 5000, zoom: 1, src: './img/title_erc.png', caption: 'testo 3'}, // 3
            ],
            audio_background: [
                {src_mp3: './audio/sultano.mp3', src_ogg: './audio/sultano.ogg', autoplay: true}
            ],
            audio_for_images: [
                {src_mp3: './audio/Oman_Speech_08.mp3'},
                {src_mp3: './audio/Oman_Speech_09.mp3'},
                {src_mp3: './audio/Oman_Speech_10.mp3'}, // 10
            ],
            pan: [
                {x: 0, y: 0}, // 2 marchi
                {x: 0, y: 0}, // 3 marchi
                {x: 0, y: 0}, // 4 marchi
            ],
            debug: false, // true if you want to show debug info.
            frames_per_second: 25, // frames per second
            fade_time: 6000, // fade time
            background_color: '#000000', // background color
            autoplay: false,
        });

        precedentPlay = new Date().getTime();
    }

//    $("status_bar ul");

}

function createAudioPlayer(indexAudioPlayer, url) {
    var div = document.createElement("div");
    $(div).attr("class", "jplayer");
    $(div).append(document.createElement("br"));
    var jplayerBackground = document.createElement("div");
    $(jplayerBackground).attr("id", "jquery_jplayer_" + indexAudioPlayer);
    var jp_container = document.createElement("div");
    $(jp_container).attr("id", "jp_container_" + indexAudioPlayer);
    $(jp_container).attr("class", "jp-audio");
    $(jp_container).html('<div class="jp-type-single">\n\
        <div class="jp-gui jp-interface">\n\
            <ul class="jp-controls">\n\
                <li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>\n\
                <li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>\n\
                <li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li>\n\
                <li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>\n\
                <li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>\n\
                <li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>\n\
            </ul>\n\
        <div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div>\n\
        <div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div>\n\
        <div class="jp-time-holder"><div class="jp-current-time"></div>\n\
        <div class="jp-duration"></div>\n\
        <ul class="jp-toggles">\n\
            <li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>\n\
            <li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>\n\
        </ul></div></div>\n\
        <div class="jp-title">' + decodeURI(url.substring(url.lastIndexOf("/") + 1)).replace(".mp3", "") + '</div>\n\
        <div class="jp-no-solution"><span>Update Required!</span> To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.</div></div>');
    $(div).append(jplayerBackground);
    $(div).append(jp_container);
    $("#audioSection").append(div);
    $("#jquery_jplayer_" + indexAudioPlayer).jPlayer({
        ready: function(event) {
            $(this).jPlayer("setMedia", {
                mp3: decodeURI(url),
                oga: decodeURI(url).replace(".mp3", ".ogg")
            });
        },
        swfPath: "js/",
        supplied: "oga,mp3",
        wmode: "window",
        smoothPlayBar: true,
        keyEnabled: true,
        cssSelectorAncestor: "#jp_container_" + indexAudioPlayer,
    });
    $(div).draggable({
        appendTo: "body",
        helper: "clone"
    });
}










function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
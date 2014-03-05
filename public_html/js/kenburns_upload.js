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

    var args = arguments[0] || {};
    var html = document.createElement("div");
    $(html).html('\
            <div id="audio_video">\n\
                <div id="catalog">\n\
                    <h2><a href="#">Upload Images</a></h2>\n\
                    <div>\n\
                        <input id="fileuploadImage" type="file" name="files[]" data-url="server/php/" multiple><br/><br/>\n\
                        <div id="imageSection" style="height: 280px; overflow: auto;">\n\
                        </div>\n\
                    </div>\n\
                    <h2><a href="#">Upload Audio</a></h2>\n\
                    <div >\n\
                        <input id="fileuploadAudio" type="file" name="files[]" data-url="server/php/" multiple>\n\
                        <div id="audioSection" style="height: 280px; overflow: auto;">\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
            <br/>\n\
            <div id="status_bar" style="width: 850px;">\n\
                <h1 class="ui-widget-header">Status Bar</h1>\n\
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
//            $(div).disableSelection();
            $(div).attr("class", "status_bar_element");
            $(div).html("<div><div align='center' style='height: 50px;'>" + ui.draggable.html() + "</div>\n\
                        <span><b>Audio: </b></span><span id='audio" + dropped + "' style='width: 100px;'>...drag your audio here</span><br/>\n\
                        <span><b>Text: </b></span><textarea id='text' rows='2' style='width: 170px;'></textarea><br/>\n\
                        <span><b>Time: </b></span><span id='time'><input type='text' value='1' style='width: 30px;'/> seconds</span><br/>\n\
                        <span><b>Zoom: </b></span><span id='zoom'><input type='text' value='1' style='width: 30px;'/> units</span><br/>\n\
                        <span><b>Pan: </b></span><span id='text'>from <input id='panFrom' type='text' value='1' style='width: 30px;'/> to <input id='panTo'type='text' value='1' style='width: 30px;'/></span><br/>\n\</div>");
            $("<li></li>").html(div).appendTo(this);

            $(div).droppable({
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                accept: ".jplayer",
                drop: function(event, ui) {
                    console.log(ui);
                    console.log("DROPPED QUALCOSA FANCUBE");
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

    var i = 0;
    $('#fileuploadAudio').fileupload({
        dataType: 'json',
        done: function(e, data) {
            $.each(data.result.files, function(index, file) {
                if (endsWith(file.url, ".mp3")) {
                    i = i + 1;
                    //metto un player audio trascinabile

                    var div = document.createElement("div");
                    $(div).attr("class", "jplayer");
                    $(div).append(document.createElement("br"));
                    var jplayerBackground = document.createElement("div");
                    $(jplayerBackground).attr("id", "jquery_jplayer_" + i);
                    var jp_container = document.createElement("div");
                    $(jp_container).attr("id", "jp_container_" + i);
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
                                <div class="jp-title">' + decodeURI(file.url.substring(file.url.lastIndexOf("/") + 1)).replace(".mp3", "") + '</div>\n\
                                <div class="jp-no-solution"><span>Update Required!</span> To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.</div></div>');
                    $(div).append(jplayerBackground);
                    $(div).append(jp_container);
                    $("#audioSection").append(div);
                    $("#jquery_jplayer_" + i).jPlayer({
                        ready: function(event) {
                            $(this).jPlayer("setMedia", {
                                mp3: decodeURI(file.url),
                                oga: decodeURI(file.url).replace(".mp3", ".ogg")
                            });
                        },
                        swfPath: "js/",
                        supplied: "oga,mp3",
                        wmode: "window",
                        smoothPlayBar: true,
                        keyEnabled: true,
                        cssSelectorAncestor: "#jp_container_" + i,
                    });

                    $(div).draggable({
                        appendTo: "body",
                        helper: "clone"
                    });
                }
            });
        }
    });
};

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
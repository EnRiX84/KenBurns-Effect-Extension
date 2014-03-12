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
var PLACEHOLDER = "placeholder";

$.fn.kenburns_upload = function() {
    var msg_drag_background = "...drag your <b>Audio background</b> here";
    var msg_drag_audio = "...drag your trace here";
    var msg_drag_images = "...drag your images here";


    var indexAudioPlayer = 0;
    var args = arguments[0] || {};
    var html = document.createElement("div");
    $(html).html('\
            <div style="display: inline-block;">\n\
                <div id="audio_video">\n\
                    <div id="catalog">\n\
                        <div><h2>Upload Images</h2></div>\n\
                        <div style="padding: 10px;">\n\
                            <input id="fileuploadImage" type="file" name="files[]" data-url="server/php/" multiple><br/><br/>\n\
                            <div id="imageSection" style="height: 265px; overflow: auto;">\n\
                            </div>\n\
                        </div>\n\
                        <div><h2>Upload Audio</h2></div>\n\
                        <div style="padding: 10px;">\n\
                            <input id="fileuploadAudio" type="file" name="files[]" data-url="server/php/" multiple>\n\
                            <div id="audioSection" style="height: 265px; width: 450px; overflow: auto;">\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
                <div id="player" align="center"></div>\n\
            </div>\n\
            <div style="display: inline-block; width: 1000px;">\n\
                <div id="status_bar">\n\
                    <h1 class="ui-widget-header" style="width: 480px;">Slides</h1>\n\
                    <div class="ui-widget-content">\n\
                        <ul style="height: 200px; overflow: auto;">\n\
                            <li class="' + PLACEHOLDER + '">' + msg_drag_images + '</li>\n\
                        </ul>\n\
                    </div>\n\
                </div>\n\
                <div id="audio_bar">\n\
                    <h1 class="ui-widget-header" style="width: 150px;">Audio</h1>\n\
                    <div class="ui-widget-content">\n\
                        <ul style="height: 200px; overflow: auto;">\n\
                            <li class="' + PLACEHOLDER + '">' + msg_drag_background + '</li>\n\
                        </ul>\n\
                    </div>\n\
                </div>\n\
                <div><span><b>width: </b><input class="width" type="text" value="800" style="width: 35px;"/>px; &nbsp;<b>height: </b><input class="height" type="text" value="600" style="width: 35px;"/>px; &nbsp;<b>frame per seconds: </b><input class="frame_per_seconds" type="text" value="25" style="width: 35px;"/></span>\n\
                <br/><span><b>background color: </b><div class="colorPicker" id="dropDownButton">\n\
                    <div style="padding: 3px;"><div id="colorPicker"></div></div>\n\
                </div></span></div>\n\
                <button style="cursor: pointer;" class="createVideo">Generate Video</button> <button style="cursor: pointer; margin-right: 10px;" class="exportVideo">JavaScript video</button> <button style="cursor: pointer; margin-right: 10px;" class="saveXML">Save XML</button>\n\
            </div>');
    $(this).append(html);

    $("#catalog").jqxNavigationBar({
        width: 490,
        height: 400
    });

    $("#colorPicker").on('colorchange', function(event) {
        $("#dropDownButton").jqxDropDownButton('setContent', getTextElementByColor(event.args.color));
    });

    $("#colorPicker").jqxColorPicker({color: "000000", colorMode: 'hue', width: 220, height: 200});    //001CF7 BLU
    $("#dropDownButton").jqxDropDownButton({width: 120, height: 22});
    $("#dropDownButton").jqxDropDownButton('setContent', getTextElementByColor(new $.jqx.color({hex: "000000"})));

    var audioindex = 0;
    $("#audio_bar ul").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".jplayer",
        drop: function(event, ui) {
            audioindex = audioindex + 1;
            $(this).find("." + PLACEHOLDER).remove();
            var jplayer = ui.draggable;
            var title = "";
            var duration = "";
            var src = "";
            var div = document.createElement("div");

            $(jplayer).find(".jp-duration").each(function() {
                duration = $(this).text();
            });
            $(jplayer).find(".jp-title").each(function() {
                title = $(this).text();
            });
            $(jplayer).find("audio").each(function() {
                src = $(this).attr("src");
                src = src.replace(".ogg", ".mp3");
            });
            $(div).attr("name", src).attr("duration", duration).html(title + " - " + duration + "<img id='clearAudioBack" + audioindex + "' style='cursor: pointer;' src='css/images/clear.png'/>");

            var li = document.createElement("li");
            $(li).attr("id", "backindex" + audioindex);
            $(li).html(div).appendTo(this);
            $("#clearAudioBack" + audioindex).click(function() {
                $(this).parent().parent().remove();
                return false;
            });
        }
    }).sortable({
        items: "li:not(." + PLACEHOLDER + ")",
        sort: function() {
            $(this).removeClass("ui-state-default");
            $("#status_bar ul").removeClass("ui-state-default");
        }
    });

    var dropped = 0;
    $("#status_bar ul").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper, .jplayer)",
        drop: function(event, ui) {
            dropped = dropped + 1;
            $(this).find("." + PLACEHOLDER).remove();
            var div = document.createElement("div");
            $(div).attr("id", "status_bar_id_" + dropped);
            $(div).attr("class", "status_bar_element");
            $(div).html("<div>\n\
                        <div align='center' style='height: 50px;'>" + ui.draggable.html() + "</div>\n\
                        <span><b>Audio: </b></span><span id='audio" + dropped + "' class='audio' name='' style='width: 100px;'>" + msg_drag_audio + "</span> <img id='clearAudio" + dropped + "' style='cursor: pointer;' src='css/images/clear.png'/><br/>\n\
                        <span><b>Text: </b></span><textarea class='text' style='max-height: 50px; height: 15px; width: 130px; max-width: 170px;'></textarea><br/>\n\
                        <span><b>Time: </b></span><span><input class='duration' type='text' value='5000' style='width: 50px;'/> milliseconds</span><br/>\n\
                        <span><b>Zoom: </b></span><span><input class='zoom' type='text' value='1.1' style='width: 30px;'/> units</span><br/>\n\
                        <span><b>Pan: </b></span><span>x: <input class='panFrom' type='text' value='1' style='width: 30px;'/> y: <input class='panTo'type='text' value='1' style='width: 30px;'/></span>\n\
                        <div id='delete" + dropped + "' align='center'><img style='cursor: pointer;' src='css/images/delete.png'/></div><br/></div>");
            $("<li></li>").html(div).appendTo(this);
            $("#delete" + dropped).click(function() {
                var r = confirm("Are you sure?");
                if (r == true) {
                    $(this).parent().parent().parent().remove();
                }
                return false;
            });

            $("#clearAudio" + dropped).click(function() {
                $("#audio" + dropped).html(msg_drag_audio);
                $("#audio" + dropped).attr("name", "");
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
                        src = src.replace(".ogg", ".mp3");
                    });
                    $(audio).attr("name", src).attr("duration", duration).html(title + " - " + duration);
                }
            });
        }
    }).sortable({
        items: "li:not(." + PLACEHOLDER + ")",
        sort: function() {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $(this).removeClass("ui-state-default");
        }
    });

    $(".createVideo").jqxButton().click(function(event) {
        event.preventDefault();
        generateVideo();
        return false;
    });

    $(".exportVideo").jqxButton().click(function(event) {
        event.preventDefault();
        generateVideo(true);
        return false;
    });

    $(".saveXML").jqxButton().click(function(event) { //{ width: '150'}
        event.preventDefault();

        generateVideo(false, true);
        return false;
    });

    //******************************** IMMAGINI DI TEST ********************************
    var span = document.createElement("span");
    $(span).attr("style", " padding: 5px; max-height: 50px; max-width: 50px;")
    var img = document.createElement("img");
    $(img).attr("src", "http://www.letiziabernardi.it/images/immagini_di_natale_5.jpg").attr("style", "max-height: 50px; max-width: 50px;");
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

    var span = document.createElement("span");
    $(span).attr("style", " padding: 5px; max-height: 50px; max-width: 50px;")
    var img = document.createElement("img");
    $(img).attr("src", "http://img2.fotoalbum.virgilio.it/v/www1-3/176/176513/304872/IMG_0880-vi.jpg").attr("style", "max-height: 50px; max-width: 50px;");
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
    $(img).attr("src", "http://4.bp.blogspot.com/_Z2V0ybeHVIc/TBfzwmqkgPI/AAAAAAAAEUc/mor4mV41vho/s1600/IMG_6883.JPG").attr("style", "max-height: 50px; max-width: 50px;");
    $(span).append(img);
    $(img).disableSelection();
    $("#imageSection").append(span);
    $(span).draggable({
        appendTo: "body",
        helper: "clone"
    });

    createAudioPlayer(30, "http://localhost/slider/audio/Arisa_Sanremo_2012.mp3");
    createAudioPlayer(40, "http://localhost/slider/audio/Arisa_Sanremo_2014.mp3");
    createAudioPlayer(50, "http://localhost/slider/audio/caparezza.mp3");

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

function getTextElementByColor(color) {
    if (color == 'transparent' || color.hex == "") {
        return $("<div style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>transparent</div>");
    }
    var element = $("<div style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>#" + color.hex + "</div>");
    var nThreshold = 105;
    var bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
    var foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';
    element.css('color', foreColor);
    element.css('background', "#" + color.hex);
    element.addClass('jqx-rc-all');
    return element;
}

var precedentPlay = new Date().getTime();
function generateVideo(exportVideo, xml) {
    var width = $($(".width")[0]).val();
    var height = $($(".height")[0]).val();
    var frame_per_seconds = $($(".frame_per_seconds")[0]).val();
    var background_color = $("#dropDownButton").jqxDropDownButton('getContent');

    //******************* AUDIO ****************
    var xml_audio_background = "<audio_background>";
    var audio_background_text = "[";
    var audio_background = [];
    var audio_background_element = $("#audio_bar ul").children();
    for (var i = 0; i < audio_background_element.length; i++) {
        var xml_audio = "<audio>";
        var mp3 = $(audio_background_element[i]).find("div").attr("name");
        var duration = $(audio_background_element[i]).find("div").attr("duration");
        if (mp3 != undefined && duration != undefined) {
            xml_audio += "<mp3>" + mp3 + "</mp3><ogg></ogg><duration>" + duration + "</duration>";
            audio_background.push({mp3: mp3, duration: duration});
            audio_background_text += "\n                          {mp3: '" + mp3 + "', duration: '" + duration + "'},";
        }
        xml_audio += "</audio>";
    }
    audio_background_text += "],";
    xml_audio_background += xml_audio + "</audio_background>";
    //******************************************

    var elements = $("#status_bar ul").children();
    var images = [];
    var images_text = "[";
    var audio_for_images = [];
    var audio_for_images_text = "[";
    var pan = [];
    var pan_text = "[";

    if (elements.length == 0 || $(elements[0]).attr("class") == PLACEHOLDER) {
        alert("You must drag at least one image");
    }

    var xml_slides = "<slides>";
    for (var i = 0; i < elements.length; i++) {
        var xml_slide = "<slide>";

        var img_src = $(elements[i]).find("img")[0].src;
        var img_display_time = $(elements[i]).find("input.duration").val();
        var img_zoom_time = $(elements[i]).find("input.zoom").val();
        var img_caption = $(elements[i]).find("textarea.text").val();

        var pan_x = $(elements[i]).find("input.panFrom").val();
        var pan_y = $(elements[i]).find("input.panTo").val();

        var mp3 = $(elements[i]).find("span.audio").attr("name");
        var duration = $(elements[i]).find("span.audio").attr("duration");

        images.push({display_time: img_display_time, zoom: img_zoom_time, src: img_src, caption: img_caption});
        images_text += "\n                          {display_time: '" + img_display_time + "', zoom: '" + img_zoom_time + "', src: '" + img_src + "', caption: '" + img_caption + "'},";
        audio_for_images.push({mp3: mp3});
        audio_for_images_text += "\n                          {mp3: '" + mp3 + "'},";
        pan.push({x: pan_x, y: pan_y});
        pan_text += "\n                          {x: '" + pan_x + "', y: '" + pan_y + "'},";

        var src_ogg = (mp3.indexOf(".mp3") != -1) ? mp3.replace(".mp3", ".ogg") : mp3;

        xml_slide += "<img>" + img_src + "</img>";
        xml_slide += "<display_time>" + img_display_time + "</display_time>";
        xml_slide += "<zoom_time>" + img_zoom_time + "</zoom_time>";
        xml_slide += "<caption>" + img_caption + "</caption>";
        xml_slide += "<pan><x>" + pan_x + "</x><y>" + pan_y + "</y></pan>";
        xml_slide += "<audio><mp3>" + mp3 + "</mp3><ogg>" + src_ogg + "</ogg><duration>" + duration + "</duration></audio>";
        xml_slide += "<img>" + img_src + "</img>";
        xml_slide += "</slide>";
        xml_slides += xml_slide;
    }
    xml_slides += "</slides>";

    images_text += "],";
    audio_for_images_text += "],";
    pan_text += "],";

    var actuallyDataSlide = new Date().getTime();
    if ((actuallyDataSlide - precedentPlay) > 2000) {
        var newPlayer = document.createElement("div");
        $("#player").html("Ready! press Play or <a href='#'>Download video</a><br/><br/>");
        $("#player").append(newPlayer);

        $(newPlayer).kenburns_extension({
            width: 400,
            height: 300,
            status_bar: true, //set if you want see the status bar
            autoplay: false, // set true if status_bar is false
            slide_controller: true, //set if you want see the slide controller
            debug: false, // true if you want to show debug info.
            images: images,
            audio_background: audio_background,
            audio_for_images: audio_for_images,
            pan: pan,
            frames_per_second: frame_per_seconds, // frames per second
            fade_time: 6000, // fade time
            background_color: $(background_color).text(), // background color
        });

        if (exportVideo) {
            var string = "\
                <!--Include \n\
                   <div class='kenburns_effect'></div> \n\
                   in your BODY element. \n\
                   After this include this script: --> \n\
                <script type='text/javascript'>\n\
                    $(function() {\n\
                            $('.kenburns_effect').kenburns_extension({\n\
                               width: " + width + " , \n\
                               height: " + height + ",\n\
                               status_bar: true,\n\
                               autoplay: false,\n\
                               slide_controller: true,\n\
                               images: " + images_text + "\n\
                               audio_background: " + audio_background_text + "\n\
                               audio_for_images: " + audio_for_images_text + "\n\
                               pan: " + pan_text + "\n\
                               debug: false,\n\
                               frames_per_second: " + frame_per_seconds + ",\n\
                               background_color: '" + $(background_color).text() + "' \n\
                            });\n\
                    });\n\
                </script>";
            alert(string);
        }

        if (xml) {
            var xml_image_upload = ""
            var images = $("#imageSection").find("img");
            for (var i = 0; i < images.length; i++) {
                xml_image_upload += "<img>" + $(images[i]).attr("src") + "</img>";
            }

            var xml_audio_upload = ""
            var audio = $("#audioSection").find("audio");
            for (var i = 0; i < audio.length; i++) {
                var src = $(audio[i]).attr("src");
                var src_mp3 = (src.indexOf(".ogg") != -1) ? src.replace(".ogg", ".mp3") : src;
                var src_ogg = (src.indexOf(".mp3") != -1) ? src.replace(".mp3", ".ogg") : src;
                xml_audio_upload += "<audio><mp3>" + src_mp3 + "</mp3><ogg>" + src_ogg + "</ogg></audio>";
            }

            var xml_frame_per_seconds = "<frame_per_seconds>" + frame_per_seconds + "</frame_per_seconds>";
            var xml_background_color = "<background_color>" + $(background_color).text() + "</background_color>";
            var xml_debug = "<debug>false</debug>";
            var xml_slide_controller = "<slide_controller>true</slide_controller>";
            var xml_autoplay = "<autoplay>false</autoplay>";
            var xml_status_bar = "<status_bar>true</status_bar>";
            var xml_width = "<width>" + width + "</width>";
            var xml_height = "<height>" + height + "</height>";

            var xml = '<?xml version="1.0" encoding="UTF-8"?>';
            xml += "<kenburns_xml>";
            xml += xml_slides;
            xml += xml_audio_background
            xml += "<image_upload>" + xml_image_upload + "</image_upload>";
            xml += "<audio_upload>" + xml_audio_upload + "</audio_upload>";
            xml += "<meta_video_info>" + xml_width + xml_height + xml_frame_per_seconds + xml_background_color + xml_debug + xml_slide_controller + xml_autoplay + xml_status_bar + "</meta_video_info>";
            xml += "</kenburns_xml>";
            var xml_print = vkbeautify.xml(xml);
            var blob = new Blob([xml_print], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "xml_kenburns_" + getData() + ".xml");
        }
        precedentPlay = new Date().getTime();
    }
}

function getData() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();

    if (m.toString().length == 1)
        m = '0' + m;
    if (d.toString().length == 1)
        d = '0' + d;

    return y + '-' + m + '-' + d;
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
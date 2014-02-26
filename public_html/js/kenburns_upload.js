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
    $(html).html('<script id="template-upload" type="text/x-tmpl">{% for (var i=0, file; file=o.files[i]; i++) { %}<tr class="template-upload fade"><td><span class="preview"></span></td><td><p class="name">{%=file.name%}</p><strong class="error"></strong></td><td><p class="size">Processing...</p><div class="progress"></div></td><td>{% if (!i && !o.options.autoUpload) { %}<button class="start" disabled>Start</button>{% } %}{% if (!i) { %}<button class="cancel">Cancel</button>{% } %}</td></tr>{% } %}</script><script id="template-download" type="text/x-tmpl">{% for (var i=0, file; file=o.files[i]; i++) { %}<tr class="template-download fade"><td><span class="preview">{% if (file.thumbnailUrl) { %}<a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}"></a>{% } %}</span></td><td><p class="name"><a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?\'data-gallery\':\'\'%}>{%=file.name%}</a></p>{% if (file.error) { %}<div><span class="error">Error</span> {%=file.error%}</div>{% } %}</td><td><span class="size">{%=o.formatFileSize(file.size)%}</span></td><td><button class="delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields=\'{"withCredentials":true}\'{% } %}>Delete</button><input type="checkbox" name="delete" value="1" class="toggle"></td></tr>{% } %}</script>\n\
        <script src="http://blueimp.github.io/JavaScript-Templates/js/tmpl.min.js"></script>\n\
        <script src="http://blueimp.github.io/JavaScript-Load-Image/js/load-image.min.js"></script>\n\
        <script src="http://blueimp.github.io/JavaScript-Canvas-to-Blob/js/canvas-to-blob.min.js"></script>\n\
        <script src="http://blueimp.github.io/Gallery/js/jquery.blueimp-gallery.min.js"></script>\n\
        <script src="js/jquery.iframe-transport.js"></script><script src="js/jquery.fileupload.js"></script>\n\
        <script src="js/jquery.fileupload-process.js"></script><script src="js/jquery.fileupload-image.js"></script>\n\
        <script src="js/jquery.fileupload-audio.js"></script><script src="js/jquery.fileupload-video.js"></script>\n\
        <script src="js/jquery.fileupload-validate.js"></script><script src="js/jquery.fileupload-ui.js"></script>\n\
        <script src="js/jquery.fileupload-jquery-ui.js"></script><script src="js/main.js"></script>');
    $(this).append(html);
    
};

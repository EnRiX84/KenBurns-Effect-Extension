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
         <div style="width: 530px;"><form id="fileupload" action="//jquery-file-upload.appspot.com/" method="POST" enctype="multipart/form-data">\n\
            <div class="fileupload-buttonbar">\n\
                    <div class="fileupload-buttons">\n\
                        <span class="fileinput-button">\n\
                            <span>Add files...</span>\n\
                            <input type="file" data-url="server/php/" name="files[]" multiple>\n\
                        </span>\n\
                        <button type="submit" class="start">Start upload</button>\n\
                        <button type="reset" class="cancel">Cancel upload</button>\n\
                        <button type="button" class="delete">Delete</button>\n\
                        <input type="checkbox" class="toggle">\n\
                            <span class="fileupload-process"></span>\n\
                    </div>\n\
                    <div class="fileupload-progress fade" style="display:none">\n\
                        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>\n\
                        <div class="progress-extended">&nbsp;</div>\n\
                    </div>\n\
            </div><table role="presentation" style="width: 530px;">\n\
                    <tbody class="files" style="width: 530px;"></tbody></table>\n\
        </form>\n\
        </div>\n\
        <script id="template-upload" type="text/x-tmpl">{% \n\
            for (var i=0, file; file=o.files[i]; i++) { %}\n\
                <tr class="template-upload fade">\n\
                    <td><span class="preview"></span></td>\n\
                    <td><span class="name">{%=file.name%}</span><strong class="error"></strong></td>\n\
                    <td><span class="size">Processing...</span><span class="progress" style="width: 30px;"></span></td>\n\
                    <td>{% if (!i && !o.options.autoUpload) { %}<button class="start" disabled>Start</button>{% } %}\n\
                            {% if (!i) { %}<button class="cancel">Cancel</button>{% } %}</td>\n\
                 </tr>{% } %}\n\
        </script>\n\
        <script id="template-download" type="text/x-tmpl">{% \n\
            for (var i=0, file; file=o.files[i]; i++) { %}\n\
                <tr class="template-download fade">\n\
                    <td><span class="preview">{% if (file.thumbnailUrl) { %}\n\
                            <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery>\n\
                            <img src="{%=file.thumbnailUrl%}" style="max-height: 16px;"\n\
                            </a>{% } %}\n\
                       </span>\n\
                    </td><td><p class="name">\n\
                        <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?\'data-gallery\':\'\'%}>{%=file.name%}</a></p>{% if (file.error) { %}<div><span class="error">Error</span> {%=file.error%}</div>{% } %}</td><td>\n\
                        <span class="size">{%=o.formatFileSize(file.size)%}</span></td><td>\n\
                        <button class="delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields=\'{"withCredentials":true}\'{% } %}>Delete</button>\n\
                        <input type="checkbox" name="delete" value="1" class="toggle"></td></tr>{% } %}</script>\n\
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

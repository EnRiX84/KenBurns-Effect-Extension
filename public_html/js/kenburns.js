/*
 Ken Burns effect JQuery plugin
 Copyright (C) 2011 Will McGugan http://www.willmcgugan.com
 
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

/*
 * This copy is modified by Enrico Caruso http://www.xbrowser.altervista.it
 * to add "Start", "Pause", "Next", Previous", and Status Bar functions
 */

(function($) {
    $.fn.kenburns = function(options) {
        var intervalVar;

        var $canvas = $(this);
        var ctx = this[0].getContext('2d');
        var start_time = null;
        var width = $canvas.width();
        var height = $canvas.height();
        var debug = options.debug;
        var image_paths = options.images;
        var display_time = options.display_time || 7000;
        var fade_time = Math.min(display_time / 2, options.fade_time || 1000);
        //var solid_time = display_time - (fade_time * 2);
        //var fade_ratio = fade_time - display_time
        var frames_per_second = options.frames_per_second || 30;
        var frame_time = (1 / frames_per_second) * 1000;
        //var zoom_level = 1 / (options.zoom || 2);
        var clear_color = options.background_color || '#000000';
        var last_frame = -1;

        var zoom_levels = [];
        $(options.zoom).each(function(i, zoom) {
            zoom_level = 1 / zoom;
            zoom_levels.push(zoom_level);
        });

        var pan_directions = [];
        $(options.pan).each(function(i, pan_direction) {
            pan_directions.push(pan_direction);
        });

        var display_times = [];
        var total_time = 0;
        $(options.display_times).each(function(i, display_time) {
            total_time += display_time;
            display_times.push(total_time);
        });

        var images = [];
        $(image_paths).each(function(i, image_path) {
            images.push({path: image_path,
                initialized: false,
                loaded: false});
        });

        function interpolate_point(x1, y1, x2, y2, i) {
            // Finds a point between two other points
            return  {x: x1 + (x2 - x1) * i,
                y: y1 + (y2 - y1) * i}
        }

        function interpolate_rect(r1, r2, i) {
            // Blend one rect in to another
            var p1 = interpolate_point(r1[0], r1[1], r2[0], r2[1], i);
            var p2 = interpolate_point(r1[2], r1[3], r2[2], r2[3], i);
            return [p1.x, p1.y, p2.x, p2.y];
        }

        function scale_rect(r, scale) {
            // Scale a rect around its center
            var w = r[2] - r[0];
            var h = r[3] - r[1];
            var cx = (r[2] + r[0]) / 2;
            var cy = (r[3] + r[1]) / 2;
            var scalew = w * scale;
            var scaleh = h * scale;
            return [cx - scalew / 2,
                cy - scaleh / 2,
                cx + scalew / 2,
                cy + scaleh / 2];
        }

        function fit(src_w, src_h, dst_w, dst_h) {
            // Finds the best-fit rect so that the destination can be covered
            var src_a = src_w / src_h;
            var dst_a = dst_w / dst_h;
            var w = src_h * dst_a;
            var h = src_h;
            if (w > src_w)
            {
                var w = src_w;
                var h = src_w / dst_a;
            }
            var x = (src_w - w) / 2;
            var y = (src_h - h) / 2;
            return [x, y, x + w, y + h];
        }

        function get_image_info(image_index, load_callback) {
            // Gets information structure for a given index
            // Also loads the image asynchronously, if required		
            var image_info = images[image_index];
            if (!image_info.initialized) {
                var image = new Image();
                image_info.image = image;
                image_info.loaded = false;
                image.onload = function() {
                    image_info.loaded = true;
                    var iw = image.width;
                    var ih = image.height;

                    var zoom_level = Math.abs(zoom_levels[image_index]);
                    var zoom_in = zoom_levels[image_index] >= 0;
                    var r1 = fit(iw, ih, width, height);
                    var r2 = scale_rect(r1, zoom_level);

                    //var align_x = Math.floor(Math.random() * 3) - 1;
                    var align_x = (image_index < pan_directions.length) ?
                            pan_directions[image_index].x : Math.floor(Math.random() * 3) - 1;
                    //var align_y = Math.floor(Math.random() * 3) - 1;
                    var align_y = (image_index < pan_directions.length) ?
                            pan_directions[image_index].y : Math.floor(Math.random() * 3) - 1;
                    align_x /= 2;
                    align_y /= 2;

                    var x = r2[0];
                    r2[0] += x * align_x;
                    r2[2] += x * align_x;

                    var y = r2[1];
                    r2[1] += y * align_y;
                    r2[3] += y * align_y;

                    //if (image_index % 2) {
                    if (zoom_in) {
                        image_info.r1 = r1;
                        image_info.r2 = r2;
                    }
                    else {
                        image_info.r1 = r2;
                        image_info.r2 = r1;
                    }

                    if (load_callback) {
                        load_callback();
                    }

                }
                image_info.initialized = true;
                image.src = image_info.path;
            }
            return image_info;
        }

        function render_image(image_index, anim, fade) {
            // Renders a frame of the effect	
            if (anim > 1) {
                //return;
            }
            var image_info = get_image_info(image_index);
            if (image_info.loaded) {
                var r = interpolate_rect(image_info.r1, image_info.r2, anim);
                var transparency = Math.min(1, fade);

                if (transparency > 0) {
                    ctx.save();
                    ctx.globalAlpha = Math.min(1, transparency);
                    ctx.drawImage(image_info.image, r[0], r[1], r[2] - r[0], r[3] - r[1], 0, 0, width, height);
                    ctx.restore();
                }
            }
        }

        function clear() {
            // Clear the canvas
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle = clear_color;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        }

        function get_time() {
            var d = new Date();
            var current_time = d.getTime();

            var elapsed_time = current_time - start_time;
            if (elapsed_time > total_time) {
                var delta = elapsed_time - total_time;
                start_time = current_time - delta;
            }
            return current_time - start_time;
        }

        var update_time;
        var stopped_time = false;
//        var forward_backword_time = true;
        var current_time;

        function update() {
            // Render the next frame	

            if (stopped_time == false) {
                var d = new Date();
                current_time = d.getTime();
            } else {
                current_time += 50;
            }

            var elapsed_time = current_time - start_time;
            if (elapsed_time > total_time) {
                var delta = elapsed_time - total_time;
                start_time = current_time - delta;
            }
            update_time = current_time - start_time;

            var top_frame = 0;
            var frame_start_time = 0;
            for (i = 0; i < display_times.length; i++) {
                frame_start_time = (i > 0) ? display_times[i - 1] : 0;
                if (update_time > frame_start_time && update_time <= display_times[i]) {
                    top_frame = i;
                    display_time = display_times[i] - frame_start_time;
                    break;
                }
            }
//            var top_frame = Math.floor(update_time / (display_time - fade_time));						
//            var frame_start_time = top_frame * (display_time - fade_time);			
            var time_passed = update_time - frame_start_time;
            function wrap_index(i) {
                return (i + images.length) % images.length;
            }

            var fade_out = 1;
            var fade_in = 0;

            if (time_passed < fade_time) {
                var bottom_frame = top_frame - 1;
                var bottom_frame_start_time = frame_start_time - display_time + fade_time;
                var bottom_time_passed = update_time - bottom_frame_start_time;
                if (update_time < fade_time) {
                    // All'inizio non c'è un'immagine che precede la prima e quindi
                    // il fade si fa con il background
                    clear();
                } else {
                    var fade_out = 1 - (time_passed / fade_time);
                    render_image(wrap_index(bottom_frame), (bottom_time_passed + fade_time) / display_time, fade_out);
                }
            }

            var fade_in = time_passed / fade_time;
            render_image(wrap_index(top_frame), (time_passed) / display_time, fade_in);

            if (options.post_render_callback) {
                options.post_render_callback($canvas, ctx);
            }

            if (top_frame != last_frame) {
                if (options.post_display_image_callback) {
//                    console.debug('DEBUG: image=' + top_frame + ' update_time=' + update_time);
                    options.post_display_image_callback(top_frame);
                }
                last_frame = top_frame;
            }

            if (debug) {
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#000';
                ctx.font = 'bold 14px serif';
                ctx.fillRect(0, 0, ctx.canvas.width, 26);
                text = 'DEBUG: ' +
                        //' top_frame=' + top_frame +
                        //' frame_start_time=' + frame_start_time +
                        //' diplay_time=' + display_time + 
                        //' bottom_frame=' + bottom_frame +
                        ' update_time=' + update_time +
                        ' time_passed=' + time_passed +
                        ' fade_time=' + fade_time +
                        ' fade_in=' + fade_in +
                        ' fade_out=' + fade_out;
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#fff';
                ctx.fillText(text, 0, 20);
                ctx.restore();
            }

            // Pre-load the next image in the sequence, so it has loaded
            // by the time we get to it
            var preload_image = wrap_index(top_frame + 1);
            get_image_info(preload_image);
        }

        // Pre-load the first two images then start a timer	
        get_image_info(0, function() {
            get_image_info(1, function() {
                start_time = (new Date()).getTime(); //get_time();
                intervalVar = setInterval(update, frame_time);
            })
        });

        this.play = function play() {
            intervalVar = setInterval(update, frame_time);
            return;
        };
        this.pause = function pause() {
            stopped_time = true;
            clearInterval(intervalVar);
            return;
        };

        this.stop = function stop() {
            start_time = (new Date()).getTime();
            update_time = 0;
            stopped_time = false;
            clearInterval(intervalVar);
            return;
        };

        this.getUpdateTime = function getUpdateTime() {
            return update_time;
        };

        this.setUpdateTime = function setUpdateTime(newTime) {
            current_time = current_time - update_time + newTime;
            stopped_time = true;
            clearInterval(intervalVar);
            intervalVar = setInterval(update, frame_time);
        };

        return this;
    };
})(jQuery);



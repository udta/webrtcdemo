/*
 * Copyright (C) 2012-2015 Grandstream <http://www.doubango.org>
 * License: BSD
 * This file is part of Open Source sipML5 solution <http://www.sipml5.org>
 */

function tsk_api_add_js_script(s_elt) {
    var tag_hdr = document.getElementsByTagName(s_elt)[0];
    for (var i = 1; i < arguments.length; ++i) {
        var tag_script = document.createElement('script');
        tag_script.setAttribute('type', 'text/javascript');
        tag_script.setAttribute('src', arguments[i]);
        tag_hdr.appendChild(tag_script);
    }
};

tsk_api_add_js_script('head',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_base64.js',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_buff.js',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_fsm.js',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_md5.js',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_param.js',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_ragel.js',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_string.js',
    './webRTC/js' + version + '/src/tinySAK/src/tsk_utils.js'
);
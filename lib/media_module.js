/*******************************************************************************
*    Code contributed to the webinos project
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*         http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* Copyright 2011 Istituto Superiore Mario Boella (ISMB)
******************************************************************************/

var fs = require("fs");
var exec = require('child_process').exec;
var wPath = require("webinos-utilities").webinosPath.webinosPath();

var pipe = "webinosOmxPipe";
var DEFAULT_PATH = '/tmp/';



this.startplay = function(path, successCB, errorCB) {
    if (!fs.existsSync(DEFAULT_PATH+pipe))
        exec('mkfifo '+DEFAULT_PATH+pipe);
    
    exec('killall omxplayer.bin');
    exec('omxplayer -o hdmi "'+path[0]+'" --vol -2400 < '+DEFAULT_PATH+pipe, function(error, stdout, stderr) {
            if(error !== null){
                if(typeof errorCB !== 'undefined')errorCB('Something is wrong');
                exec('rm /tmp/webinosOmxPlayer');
            }
            else{
                if(typeof successCB !== 'undefined')successCB(path[0] + ' is now playing!!');
            }
        });
        
    exec('echo \n > '+DEFAULT_PATH+pipe);
};

this.command = function(key,successCB, errorCB){
    if(fs.existsSync(DEFAULT_PATH+pipe))
    {
        exec('echo -n '+key.toString()+' > '+DEFAULT_PATH+pipe);
        if(key.toString() === 'q') exec('rm /tmp/webinosOmxPipe');
        if(typeof successCB === 'function')successCB("command sent");
    }
    else
        if(typeof errorCB === 'function')errorCB("no omxplayer process");
};


/**
 * Created by solvek on 26.01.16.
 */

var EXTM3U = '#EXTM3U';
var EXTINF = '#EXTINF:';

var REGEX_PARAMS = /\s*("([^"]+)"|([^=]+))=("([^"]+)"|(\S+))/g;
var REGEX_DURATION = /\s*(-?\d+)/g;

//var util = require('util');

export type Track = { title: string; length: number; params: Params; file: string; };

export type Params = Record<string, string>;

export type M3U = { tracks: Track[]; header: Params; };

function parseParams(data: string): Params {
    var result: Params = {};

    var m: RegExpExecArray | null, key: string, value: string;

    while ((m = REGEX_PARAMS.exec(data)) !== null) {
        if (m.index === REGEX_PARAMS.lastIndex) {
            REGEX_PARAMS.lastIndex++;
        }

        //console.log(util.inspect(m));

        key = m[2] ? m[2] : m[3];
        value = m[5] ? m[5] : m[6];

        result[key] = value;
    }

    //console.log(util.inspect(result));
    return result;
}

function formatParams(params: Params): string {
    var result: string = '';
    for(var key in params){
        result += ' ' + key + '="' + params[key]+'"';
    }

    return result;
}

function parse(content: string): M3U {
    var result: M3U = {
        tracks: [],
        header: {}
    };

    //console.log(content);
    var lines: string[] = content.split('\n');

    var line: string, current: Track = {} as Track, pos: number, duration: RegExpMatchArray;
    for(var i=0;i<lines.length;i++){
        line = lines[i]!.trim();

        if (line == ''){
            continue;
        }

        if (line.indexOf(EXTM3U) == 0){
            result.header = parseParams(line.substr(EXTM3U.length));
            continue;
        }

        if (line.indexOf(EXTINF) == 0){
            pos = line.lastIndexOf(',');
            current.title = line.substr(pos+1).trim();

            line = line.substring(EXTINF.length, pos).trim();
            duration = line.match(REGEX_DURATION);

            current.length = parseInt(duration[0]);

            current.params = parseParams(line.substr(duration[0].length));
            continue;
        }

        if (line.indexOf("#") == 0){
            continue;
        }

        current.file = line;

        //console.log(util.inspect(current));
        result.tracks.push(current);

        current = {} as Track;
    }

    return result;
}

function format(m3u: M3U): string {
    var result: string = EXTM3U;
    if (m3u.header){
        result += formatParams(m3u.header);
    }
    result+= '\n';
    m3u.tracks.forEach(function(track){
        result += EXTINF
            +track.length
            +formatParams(track.params)
            +","
            +track.title
            +'\n'
            +track.file
            +'\n';
    });

    return result;
}

export { parse };
export { format };
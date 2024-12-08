/**
 * Created by solvek on 26.01.16.
 */

import { describe, it } from 'node:test';
import chai = require('chai');
import fs = require('fs');
import { should, expect } from 'chai';
should();

import m3u = require('../src/index.js');

describe("Parsing m3u", function() {
    var parsed: m3u.M3U = m3u.parse(fs.readFileSync('./test.m3u', 'utf8'));

    //var util = require('util');
    //console.log("Parsed: "+util.inspect(parsed));

    it("Should be parsed to object", function(){
        parsed.should.be.an('object');
        parsed.should.have.ownProperty('header');
    });

    var header: m3u.Params = parsed.header;

    it("Should have header with 2 params", function(){
        Object.keys(header).length.should.equal(2);
        header.should.be.an('object');
        header.should.have.ownProperty('param1');
        header.should.have.ownProperty('param2');
        header['param1']!.should.equal('val1');
        header['param2']!.should.equal('val2 val3');
    });

    var tracks: m3u.Track[] = parsed.tracks;

    it("Should have 3 tracks", function() {
        tracks.should.be.an('array');
        tracks.length.should.equal(3);
    });

    var track1: m3u.Track = tracks[0]!;

    it("Should parse track 1", function() {
        track1.should.be.an('object');
        track1.title.should.equal('Test');
        track1.length.should.equal(0);
        track1.params.should.be.an('object');
    });

    it("Should parse track params", function() {
        var params: m3u.Params = track1.params;
        params.should.be.an('object');
        Object.keys(params).length.should.equal(2);
        params.should.have.ownProperty('p1');
        params.should.have.ownProperty('p2');
        params['p1']!.should.equal('v1 t');
        params['p2']!.should.equal('v2');
    });

    it("Should parse track 2", function() {
        var track2: m3u.Track = tracks[1]!;

        track2.should.be.an('object');
        track2.length.should.equal(-1);
        track2.file.should.equal('http://url2');
    });

    it("Should parse track length", function() {
        var track3: m3u.Track = tracks[2]!;

        track3.should.be.an('object');
        track3.length.should.equal(500);
    });
});

describe("Formatting test", function(){
    it("Should format global params", function(){
        var formatted: string = m3u.format({header: {param1: 'val1', 'param2': 'val2'}, tracks: []});
        formatted.should.equal('#EXTM3U param1="val1" param2="val2"\n');
    });
});
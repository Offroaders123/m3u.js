/**
 * Created by solvek on 26.01.16.
 */

import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { expect } from 'chai';

import { parse, format } from '../src/index.js';
import type { M3U, Params, Track } from '../src/index.js';

describe("Parsing m3u", function() {
    const parsed: M3U = parse(readFileSync('./test.m3u', 'utf8'));

    //const util = require('util');
    //console.log("Parsed: "+util.inspect(parsed));

    it("Should be parsed to object", function() {
        expect(parsed).to.be.an('object');
        expect(parsed).to.have.ownProperty('header');
    });

    const header: Params = parsed.header;

    it("Should have header with 2 params", function() {
        expect(Object.keys(header).length).to.equal(2);
        expect(header).to.be.an('object');
        expect(header).to.have.ownProperty('param1');
        expect(header).to.have.ownProperty('param2');
        expect(header['param1']!).to.equal('val1');
        expect(header['param2']!).to.equal('val2 val3');
    });

    const tracks: Track[] = parsed.tracks;

    it("Should have 4 tracks", function() {
        expect(tracks).to.be.an('array');
        expect(tracks.length).to.equal(4);
    });

    const track1: Track = tracks[0]!;

    it("Should parse track 1", function() {
        expect(track1).to.be.an('object');
        expect(track1.title).to.equal('Test');
        expect(track1.length).to.equal(0);
        expect(track1.params).to.be.an('object');
    });

    it("Should parse track params", function() {
        const params: Params = track1.params;
        expect(params).to.be.an('object');
        expect(Object.keys(params).length).to.equal(2);
        expect(params).to.have.ownProperty('p1');
        expect(params).to.have.ownProperty('p2');
        expect(params['p1']!).to.equal('v1 t');
        expect(params['p2']!).to.equal('v2');
    });

    it("Should parse track 2", function() {
        const track2: Track = tracks[1]!;

        expect(track2).to.be.an('object');
        expect(track2.length).to.equal(-1);
        expect(track2.file).to.equal('http://url2');
    });

    it("Should parse track length", function() {
        const track3: Track = tracks[2]!;

        expect(track3).to.be.an('object');
        expect(track3.length).to.equal(500);
    });

    it("Should parse track name", function() {
        const track4: Track = tracks[3]!;

        expect(track4).to.be.an('object');
        expect(track4.title).to.equal('Test4 (3 + 1, and more!)');
    });
});

describe("Formatting test", function() {
    it("Should format global params", function() {
        const formatted: string = format({ header: { param1: 'val1', 'param2': 'val2' }, tracks: [] });
        expect(formatted).to.equal('#EXTM3U param1="val1" param2="val2"\n');
    });
});

describe("Symmetry test", function() {
    it("Should be symmetrical", function() {
        const original: string = readFileSync('./test-symmetrical.m3u', 'utf8');
        const parsed: M3U = parse(original);
        const rewritten: string = format(parsed);
        expect(original).to.be.equal(rewritten);
    });
});
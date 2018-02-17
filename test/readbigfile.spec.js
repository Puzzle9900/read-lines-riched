const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fs = require("fs-extra");
const {
    readLinesStartToEnd,
    readLinesEndToStart,
    makeTestable
} = require("../main.js");

makeTestable();

chai.use(chaiAsPromised)

const expect = chai.expect;
const assert = chai.assert;

let big_file_path = "./test/bigfile";

describe('ReadingBigFile', () => {

    it(`StartToEnd. Read file chunk 100 should return all lines total 3000`, async () => {
        var readStartToEnd = readLinesStartToEnd(big_file_path, bChunk = 100);
        var count = 0;
        while (await readStartToEnd.readNextLine()) count += 1;

        expect(count).to.be.equals(3000);
    });

    it(`EndToStart. Read file chunk 100 should return all lines total 3000`, async () => {
        var readEndToStart = readLinesEndToStart(big_file_path, bChunk = 100);
        var count = 0;
        while (await readEndToStart.readNextLine()) count += 1;

        expect(count).to.be.equals(3000);
    });

    it(`EndToStart. Read more bytes than file size`, async () => {
        var readEndToStart = readLinesEndToStart(big_file_path, bChunk = 1024*1024*1024*2);
        var count = 0;
        while (await readEndToStart.readNextLine()) count += 1;

        expect(count).to.be.equals(3000);
    });

    it(`Read file 1mb chunk 4k should take less than 50ms`, async () => {
        var readEndToStart = readLinesEndToStart(big_file_path, bChunk = 1024*4);
        var count = 0;
        var startTime = Date.now();
        while (await readEndToStart.readNextLine()) count += 1;

        var time = Date.now() - startTime;
        // console.log(`It take ${time}ms`);
        expect(time).has.to.be.lessThan(50);
        expect(count).has.to.be.equals(3000);
    });
});
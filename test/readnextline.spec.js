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
const NEW_LINE_CHARACTERS = ["\n", "\r"];

let letters_file_path = "./test/letters";
let empty_file_path = "./test/empty";
let lines_file_path = './test/lines';
let empty_lines_path = "./test/emptylines";

function platformValue(windows, macos, linux = macos ){//If not windows platform carriage return takes only one character
    if (process.platform === 'win32')
        return windows;
    else if(process.platform === 'darwin')
        return macos;
    else
        return linux
}

let carr = platformValue('\r\n', '\n','\r');

function describe1() {
    describe("#ReadNextLine 1 byte", () => {
        it("StartToEnd. Read first line should be 'Line 1'", async () => {
            let startToEndRL = readLinesStartToEnd(lines_file_path);
            expect(await startToEndRL.readNextLine()).is.equals('Line 1');
            startToEndRL.closeReader();
        });

        it("StartToEnd. Read first line should be 'a'", async () => {
            let startToEndRL = readLinesStartToEnd(empty_lines_path);
            expect(await startToEndRL.readNextLine()).is.equals('a');
            startToEndRL.closeReader();
        });

        it("StartToEnd. Read all lines should be 1 no empty line ", async () => {
            let startToEndRL = readLinesStartToEnd(empty_lines_path);
            var count = 0;
            while (await startToEndRL.readNextLine()) {
                count += 1;
            }
            expect(count).be.equals(1);
            startToEndRL.closeReader();
        });

        it("StartToEnd. Read first three lines should be 'Line 1', 'Line 2' and 'Line 3'", async () => {
            let startToEndRL = readLinesStartToEnd(lines_file_path);
            expect(await startToEndRL.readNextLine()).be.equals('Line 1');
            expect(await startToEndRL.readNextLine()).be.equals('Line 2');
            expect(await startToEndRL.readNextLine()).be.equals('Line 3');
            startToEndRL.closeReader();
        });

        it("StartToEnd. Read full file should have 6 lines.", async () => {
            let startToEndRL = readLinesStartToEnd(lines_file_path);

            var count = 0;
            while (await startToEndRL.readNextLine()) {
                count += 1;
            }

            expect(count).be.equals(6);
            startToEndRL.closeReader();
        });

        it("EndToStart. Read last line should be 'Line6'", async () => {
            let endToStartRL = readLinesEndToStart(lines_file_path);
            expect(await endToStartRL.readNextLine()).is.equals('Line6');
        });

        it("EndToStart. Read last three lines EndToStart should be 'Line6', 'Line 5' and 'Line 4'", async () => {
            let endToStartRL = readLinesEndToStart(lines_file_path);
            expect(await endToStartRL.readNextLine()).be.equals('Line6');
            expect(await endToStartRL.readNextLine()).be.equals('Line 5');
            expect(await endToStartRL.readNextLine()).be.equals('Line 4');
        });

        it("EndToStart. Read full file should have 6 no empty lines.", async () => {
            let endToStartRL = readLinesEndToStart(lines_file_path);

            var count = 0;
            while (await endToStartRL.readNextLine()) {
                count += 1;
            }

            expect(count).be.equals(6);
        });

        it("Empty file should return 0 line.", async () => {
            let endToStartRL = readLinesEndToStart(empty_file_path);
            let startToEndRL = readLinesEndToStart(empty_file_path);

            var count = 0;
            while (await endToStartRL.readNextLine() || await startToEndRL.readNextLine()) {
                count += 1;
            }

            expect(count).be.equals(0);
        });
    });
};
describe1();

describe('ReadNextLine chunk bytes', () => {

    it(`StartToEnd-UpdateCache. Read first line and some chars of second should return cache with 1 element with value hg`, async ()=>{
        let startToEndRL = readLinesStartToEnd(lines_file_path, bChunk = 8);
        var readedLines = `hg${carr}f`;
        var cache = startToEndRL.updateCache(readedLines);
        expect(cache.length).equals(1);
        expect(cache[0]).equals('hg');
    });

    it(`StartToEnd. Read 8 bytes should return Line 1`, async () => {
        let startToEndRL = readLinesStartToEnd(lines_file_path, bChunk = 8);
        expect(await startToEndRL.readNextLine()).be.equals('Line 1');
    });

    it(`StartToEnd. Read 8 bytes 3 times should read file 3 times`, async ()=>{
        let startToEndRL = readLinesStartToEnd(lines_file_path, bChunk = 8);
        expect(await startToEndRL.readNextLine()).be.equals('Line 1');
        expect(await startToEndRL.readNextLine()).be.equals('Line 2');
        expect(await startToEndRL.readNextLine()).be.equals('Line 3');
    });

    it(`StartToEnd. Read 40 bytes should should return lines 1 - 4`, async ()=>{
        let startToEndRL = readLinesStartToEnd(lines_file_path, bChunk = 40);
        expect(await startToEndRL.readNextLine()).be.equals('Line 1');
        expect(await startToEndRL.readNextLine()).be.equals('Line 2');
        expect(await startToEndRL.readNextLine()).be.equals('Line 3');
        expect(await startToEndRL.readNextLine()).be.equals('Line 4');
    });

    it(`StartToEnd. Read 40 bytes should use cache 3 times`, async ()=>{
        let startToEndRL = readLinesStartToEnd(lines_file_path, bChunk = 40);
        expect(await startToEndRL.readNextLine()).be.equals('Line 1');
        let count = 0;
        while(startToEndRL.getCache().length > 0){
            count += 1;
            await startToEndRL.readNextLine();
        }
        expect(count).to.be.equals(3);
    });

    it(`StartToEnd. Read chunks 7 bytes full file should return 6 lines`, async ()=>{
        let startToEndRL = readLinesStartToEnd(lines_file_path, bChunk = 7);
        let count = 0;
        while(await startToEndRL.readNextLine()){
            count += 1;
        }
        expect(count).to.be.equals(6);
    });

    it(`EndToStart-UpdateCache. Read las line should return cache with 1 element with value 'Line 6'`, async ()=>{
        let startToEndRL = readLinesStartToEnd(lines_file_path, bChunk = 8);
        var readedLines = `Line6${carr}${carr}`;
        var cache = startToEndRL.updateCache(readedLines);
        expect(cache.length).equals(1);
        expect(cache[0]).equals('Line6');
    });

    it(`EndToStart-UpdateCache. Read las line should return cache with 3 on respective order`, async ()=>{
        let startToEndRL = readLinesEndToStart(lines_file_path, bChunk = 8);
        var readedLines = `${carr}Line 4${carr}${carr}${carr}${carr}Line 5${carr}${carr}Line6${carr}${carr}`;
        var cache = startToEndRL.updateCache(readedLines);
        expect(cache.length).equals(3);
        expect(cache[0]).equals('Line 4');
        expect(cache[1]).equals('Line 5');
        expect(cache[2]).equals('Line6');
    });

    it(`EndToStart. Read 8 bytes should return Line6`, async () => {
        let endToStartRL = readLinesEndToStart(lines_file_path, bChunk = 8);
        expect(await endToStartRL.readNextLine()).be.equals('Line6');
    });

    it(`EndToStart. Read 10 bytes should return last lines. Until splitted carriage return on windows`, async ()=>{
        let endToStartRL = readLinesEndToStart(lines_file_path, bChunk = 10);
        expect(await endToStartRL.readNextLine()).be.equals('Line6');
    });

    it(`EndToStart. Read 40 bytes should return last 4 no empty lines`, async ()=>{
        let endToStartRL = readLinesEndToStart(lines_file_path, bChunk = 40);
        expect(await endToStartRL.readNextLine()).be.equals('Line6');
        expect(await endToStartRL.readNextLine()).be.equals('Line 5');
        expect(await endToStartRL.readNextLine()).be.equals('Line 4');
        expect(await endToStartRL.readNextLine()).be.equals('Line 3');
    });

    it(`EndToStart. Read chunks 7 bytes full file should return 6 lines`, async ()=>{
        let endToStartRL = readLinesEndToStart(lines_file_path, bChunk = 40);
        let count = 0;
        while(await endToStartRL.readNextLine()){
            count += 1;
        }
        expect(count).to.be.equals(6);
    });
});
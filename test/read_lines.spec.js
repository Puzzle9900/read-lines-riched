const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fs = require("fs-extra");
const { 
    readLinesStartToEnd,
    readLinesEndToStart
} = require("../main.js");


chai.use(chaiAsPromised)

const expect = chai.expect;
const assert = chai.assert;
const NEW_LINE_CHARACTERS = ["\n", "\r"];

let letters_file_path = "./test/letters";
let empty_file_path = "./test/empty";
let lines_file_path = './test/lines';

describe("#ReadNextChar", () => {
    let startToEndRL = readLinesStartToEnd(letters_file_path);

    let endToStartRL = readLinesEndToStart(letters_file_path);


    it("StartToEnd. Reading first character should be 'h'", async () => {
        let fd = await fs.open(letters_file_path, 'r');
        let stat = await fs.stat(letters_file_path);

        let char = await startToEndRL.readNextChar(fd, stat, 0);

        expect(char).is.equals('h');
    });

    it("StartToEnd. After read 4 characters the 5th character should be 'f'", async () => {
        let fd = await fs.open(letters_file_path, 'r');
        let stat = await fs.stat(letters_file_path);

        let char = await startToEndRL.readNextChar(fd, stat, 4);

        expect(char).is.equals('f');
    });

    it("EndToStart. Reading first chatacter should be 'u'", async () => {
        let fd = await fs.open(letters_file_path, 'r');
        let stat = await fs.stat(letters_file_path);

        let char = await endToStartRL.readNextChar(fd, stat, 0);

        expect(char).is.equals("u");
    });

    it("EndToStart. After read 4 characters the 5th character should be 'j'", async () => {
        let fd = await fs.open(letters_file_path, 'r');
        let stat = await fs.stat(letters_file_path);

        let char = await endToStartRL.readNextChar(fd, stat, 4);

        expect(char).is.equals('j');
    });

    it("EndToStart. After read 3 characters the next character should be new line character '\\n' or '\\r'", async () => {
        let fd = await fs.open(letters_file_path, 'r');
        let stat = await fs.stat(letters_file_path);

        let char = await endToStartRL.readNextChar(fd, stat, 3);

        assert(NEW_LINE_CHARACTERS.includes(char), "Character should be '\\n' or '\\r'");
    });

    it("Empty file should return empty string.", async () => {
        let fd = await fs.open(empty_file_path, 'r');

        let stat = await fs.stat(empty_file_path);

        let rl = readLinesStartToEnd(empty_file_path);

        let char = await rl.readNextChar(fd, stat, 0);

        assert.isEmpty(char, "Read empty file should return empty string");
    });
});

describe("#ReadNextLine", () => {
    it("StartToEnd. Read first line should be 'Line 1'", async () => {
        let startToEndRL = readLinesStartToEnd(lines_file_path);
        expect(await startToEndRL.readNextLine()).is.equals('Line 1');
    });

    it("StartToEnd. Read first three lines should be 'Line 1', 'Line 2' and 'Line 3'", async () => {
        let startToEndRL = readLinesStartToEnd(lines_file_path);
        expect(await startToEndRL.readNextLine()).be.equals('Line 1');
        expect(await startToEndRL.readNextLine()).be.equals('Line 2');
        expect(await startToEndRL.readNextLine()).be.equals('Line 3');
    });

    it("StartToEnd. Read full file should have 6 no empty lines.", async () => {
        let startToEndRL = readLinesStartToEnd(lines_file_path);

        var count = 0;
        while (await startToEndRL.readNextLine()) {
            count += 1;
        }

        expect(count).be.equals(6);
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
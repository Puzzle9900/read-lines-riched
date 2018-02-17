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

function platformValue(windows, macos, linux = macos ){//If not windows platform carriage return takes only one character
    if (process.platform === 'win32')
        return windows;
    else if(process.platform === 'darwin')
        return macos;
    else
        return linux
}

describe("#ReadNextChar 1 byte", () => {
    let startToEndRL = readLinesStartToEnd(letters_file_path, bChunk = 1);

    let endToStartRL = readLinesEndToStart(letters_file_path, bChunk = 1);

    let fd = fs.openSync(letters_file_path, 'r');
    let stat = fs.statSync(letters_file_path);

    it("StartToEnd. Reading first character should be 'h'", async () => {
        let char = await startToEndRL.readNextChar(fd, stat, 0);

        expect(char).is.equals('h');
    });

    it(`StartToEnd. After read 4 characters the 5th character should be ${platformValue("'f'", "'d'")}`, async () => {
        let char = await startToEndRL.readNextChar(fd, stat, 4);
        
        expect(char).is.equals(platformValue('f', 'd', 'd'));
    });

    it("EndToStart. Reading first chatacter should be 'u'", async () => {
        let char = await endToStartRL.readNextChar(fd, stat, 0);

        expect(char).is.equals("u");
    });

    it(`EndToStart. After read 4 characters the 5th character should be ${platformValue("'j'", "'h'")}`, async () => {
        let char = await endToStartRL.readNextChar(fd, stat, 4);

        expect(char).is.equals(platformValue('j', 'h'));
    });

    it(`EndToStart. After read 2 characters the next character should be '\\n'`, async () => {
        let char = await endToStartRL.readNextChar(fd, stat, 2);

        expect(char).is.equals('\n');
    });

    it("Empty file should return empty string.", async () => {
        let fd = await fs.open(empty_file_path, 'r');
        let stat = await fs.stat(empty_file_path);

        let rl = readLinesStartToEnd(empty_file_path, bChunk = 1);

        let char = await rl.readNextChar(fd, stat, 0);

        assert.isEmpty(char, "Read empty file should return empty string");
    });
});



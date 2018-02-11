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

function platformValue(windows, macos, linux ){//If not windows platform carriage return takes only one character
    if (process.platform === 'win32') {
        return windows;
    }
    return macos;
}

describe("#ReadNextChar n bytes", () => {
    
    let endToStartRL = readLinesEndToStart(letters_file_path, bChunk = 2);
    let fd = fs.openSync(letters_file_path, 'r');
    let stat = fs.statSync(letters_file_path);

    it("StartToEnd. Reading first two character should be 'hg'", async () => {
        let startToEndRL = readLinesStartToEnd(letters_file_path, bChunk = 2)

        let char = await startToEndRL.readNextChar(fd, stat, 0);

        expect(char).is.equals('hg');
    });

    it(`StartToEnd. Reading first 5 character should be ${platformValue("'hg\\r\\nf'", "'hg\\nfd'")}`, async () => {
        let startToEndRL = readLinesStartToEnd(letters_file_path, bChunk = 5)

        let char = await startToEndRL.readNextChar(fd, stat, 0);

        expect(char).is.equals(platformValue('hg\r\nf', 'hg\nfd'));
    });

    it(`StartToEnd. Reading more than te file should return full string legth = ${platformValue(18, 14)}`, async () => {
        let startToEndRL = readLinesStartToEnd(letters_file_path, bChunk = 19)

        let char = await startToEndRL.readNextChar(fd, stat, 0);

        expect(char.length).is.equals(platformValue(18, 14));
    });

    it(`StartToEnd. Reading from postition 5, 20 should return lenght = ${platformValue(13, 9)}`, async () => {
        let startToEndRL = readLinesStartToEnd(letters_file_path, bChunk = 20)

        let char = await startToEndRL.readNextChar(fd, stat, 5);

        expect(char.length).is.equals(platformValue(13, 9));
    });


    it("EndToStart. Reading first two character should be 'yu'", async () => {
        let endToStartRL = readLinesEndToStart(letters_file_path, bChunk = 2);

        let char = await endToStartRL.readNextChar(fd, stat, 0);

        expect(char).is.equals("yu");
    });

    it(`EndToStart. Reading first 6 character should be ${platformValue("'hj\\r\\nyu'", "'\\nhj\\nyu'")}`, async () => {
        let endToStartRL = readLinesEndToStart(letters_file_path, bChunk = 6);

        let char = await endToStartRL.readNextChar(fd, stat, 0);

        expect(char).is.equals(platformValue('hj\r\nyu', '\nhj\nyu'));
    });

    it(`EndToStart. Reading two times 2 chunk should 'yu' first then ${platformValue("'\\r\\n'", "'j\\n'")}`, async () => {
        let endToStartRL = readLinesEndToStart(letters_file_path, bChunk = 2);

        let char = await endToStartRL.readNextChar(fd, stat, 0);
        expect(char).is.equals("yu");

        char = await endToStartRL.readNextChar(fd, stat, 2);
        expect(char).is.equals(platformValue('\r\n', 'j\n'));
    });

    it(`EndToStart. Reading from 7 more than left should return length = ${platformValue(11, 7)}`, async () => {
        let endToStartRL = readLinesEndToStart(letters_file_path, bChunk = 20);

        let char = await endToStartRL.readNextChar(fd, stat, 7);
        expect(char.length).is.equals(platformValue(11, 7));
    });

});





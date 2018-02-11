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

function platformValue(ifWindowsValue, ifNotWindowsValue ){//If not windows platform carriage return takes only one character
    if (process.platform === 'win32') {
        return ifWindowsValue;
    }
    return ifNotWindowsValue;
}
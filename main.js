"use strict"

const promisify = require("util");
const fs = require("fs-extra");

var TESTABLE = false;
const NEW_LINE_CHARACTERS = ["\n", "\r"];

var eDir = Object.freeze({
    "StartToEnd": 1,
    "EndToStart": -1
});


function readLines(file_path, options) {
    let dir = options.dir;
    let bChunk = options.bChunk;

    const carriage = platformValue('\r\n', '\n', '\r');
    const carriageReg = platformValue(/\r\n/, /\n/, /\r/);

    async function readNextChar(fd, stat, readedCharCount, bytesChunk = bChunk) {
        if (readedCharCount == stat.size)
            return '';

        var originPos = dir === eDir.EndToStart ? stat.size : 0;

        var readSize = bytesChunk;
        var relativePosition = (originPos + dir * readedCharCount);

        var readPosition = dir === eDir.EndToStart ? relativePosition - readSize : relativePosition;
        if (readPosition < 0) //If end to start read the characters left
        {
            readPosition = 0;
            readSize = relativePosition;
        } else if (readPosition + readSize > stat.size) //If start to end read the characters left
        {
            readPosition = relativePosition
            readSize = stat.size - relativePosition;
        }

        var {
            readBytes,
            buffer
        } = await fs.read(fd, Buffer.alloc(readSize), 0, readSize, readPosition);

        return buffer.toString('utf8');
    };

    let self = {
        fd: null,
        stat: null
    };

    let initConfig = Promise.all([
        fs.open(file_path, 'r').then(fd => self.fd = fd),
        fs.stat(file_path).then(stat => self.stat = stat),
    ]);


    let readedCharCount = 0;
    var linesCache = [];

    async function readNextLine() {
        await initConfig;

        if (linesCache.length > 0)
            return linesCache.pop();

        var line = await readLinesCache();
        return line;
    }

    async function readLinesCache() {
        let lines = '';

        var charsChunk;
        var carriageCount = 0;

        var newLinePattern = dir === eDir.StartToEnd ? /.\r|.\n/ : /\r.|\n./;

        while ((charsChunk = await readNextChar(self.fd, self.stat, readedCharCount))) {
            readedCharCount += charsChunk.length;
            lines = dir === eDir.StartToEnd ? lines + charsChunk : charsChunk + lines;

            if (newLinePattern.test(lines))
                break;
        }

        linesCache = updateCache(lines);

        return linesCache.length > 0 ? linesCache.pop() : '';
    }

    function updateCache(newLines) {
        var linesArr = newLines.split(/\r|\n/);
        var lastCharIsNewLine = dir === eDir.StartToEnd ? linesArr[linesArr.length - 1] : linesArr[0];
        linesArr = linesArr.filter(x => x);
        if (linesArr.length > 1 && lastCharIsNewLine) //last item depending direction is dirty if is not new line 
            readedCharCount -= dir === eDir.StartToEnd ? linesArr.pop().length : linesArr.shift().length;

        if (dir === eDir.StartToEnd) {
            linesArr = linesArr.reverse();
        }
        return linesArr.concat(linesCache);
    }

    function platformValue(windows, macos, linux = macos) { //If not windows platform carriage return takes only one character
        if (process.platform === 'win32')
            return windows;
        else if (process.platform === 'darwin')
            return macos;
        else
            return linux
    }

    async function closeReader() {
        await fs.close(self.fd);
    }

    function getCache()
    {
        return linesCache;
    }

    if (TESTABLE)
        return {
            readNextChar: readNextChar,
            readNextLine: readNextLine,
            closeReader: closeReader,
            updateCache: updateCache,
            getCache: getCache
        };
    else
        return {
            readNextChar: readNextChar,
            readNextLine: readNextLine,
            closeReader: closeReader,
        };
}

function readLinesStartToEnd(file_path, bChunk = 1024, dir = eDir.StartToEnd) {
    var options = {};
    options.bChunk = bChunk;
    options.dir = dir;
    return readLines(file_path, options);
}

function readLinesEndToStart(file_path, bChunk = 1024, dir = eDir.EndToStart) {
    var options = {};
    options.bChunk = bChunk;
    options.dir = dir;
    return readLines(file_path, options);
}

function makeTestable(){
    TESTABLE = true;
}

module.exports = {
    readLinesStartToEnd: readLinesStartToEnd,
    readLinesEndToStart: readLinesEndToStart,
    makeTestable: makeTestable
};
"use strict"

const promisify = require("util");
const fs = require("fs-extra");
const NEW_LINE_CHARACTERS = ["\n", "\r"];

var eDir = Object.freeze({
    "StartToEnd": 1,
    "EndToStart": -1
});


function readLines(file_path, options) {
    let dir = options.dir;
    let bChunk = options.bChunk;

    const carriage = platformValue('\r\n', '\n','\r');

    async function readNextChar(fd, stat, readedCharCount) {
        if(readedCharCount == stat.size)
            return '';

        var originPos = dir === eDir.EndToStart ? stat.size : 0;

        var readSize = bChunk;
        var relativePosition = (originPos + dir * readedCharCount);

        var readPosition = dir === eDir.EndToStart ? relativePosition - readSize : relativePosition;
        if (readPosition < 0)//If end to start read the characters left
        {
            readPosition = 0;
            readSize = relativePosition;
        }
        else if(readPosition + readSize > stat.size)//If start to end read the characters left
        {
            readPosition = relativePosition
            readSize = stat.size - relativePosition;
        }

        var { readBytes, buffer} = await fs.read(fd, Buffer.alloc(readSize), 0, readSize, readPosition);

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
    let lines_cache = [];

    async function readNextLine() {
        await initConfig;

        // await cleanForNextRead();
        if(linesCache.length > 1)
            return linesCache.pop();
        var line = await readLinesCache();
        return line;
    }

    async function readLinesCache()
    {
        let lines = '';

        var charsChunk;
        while((charsChunk = await readNextChar(self.fd, self.stat, readedCharCount)))
        {
            readedCharCount += charsChunk.length;
            lines = dir === eDir.StartToEnd ? lines + charsChunk : charsChunk + lines;

            if(charsChunk.includes(carriage) && /\w/i.test(lines))//Avoid empty lines with enters
                break;
        }

        if(linesCache.length == 1 && linesCache[0])
        {
            var mayInconcluseLine = linesCache.pop();
            lines = dir === eDir.StartToEnd ? mayInconcluseLine + lines : lines + mayInconcluseLine;
        }

        var linesArr = lines.split(carriage).filter(x => x);//removing empty strings
        if(eDir.StartToEnd)
            linesArr = linesArr.reverse();

        linesCache = linesCache.concat(linesArr);
        
        return linesCache.length > 0 ? linesCache.pop(): '';
    }

    async function readLine()
    {
        let line = "";

        var char = await readNextChar(self.fd, self.stat, readedCharCount);

        while(char && !isNewLineOrUnknown(char)){
            line += char;

            readedCharCount += 1;
            char = await readNextChar(self.fd, self.stat, readedCharCount);
        }

        return dir === eDir.StartToEnd ? line: line.split('').reverse().join('');
    }

    async function cleanForNextRead()
    {
        var char = await readNextChar(self.fd, self.stat, readedCharCount);

        while(char && isNewLineOrUnknown(char))//Cleaning \\n \\r or unknown characters
        {
            readedCharCount += char.length;

            char = await readNextChar(self.fd, self.stat, readedCharCount);
        }
    }

    function isNewLineOrUnknown(char)
    {
        return NEW_LINE_CHARACTERS.includes(char) || char.length > 1;
    }

    function platformValue(windows, macos, linux = macos ){//If not windows platform carriage return takes only one character
        if (process.platform === 'win32')
            return windows;
        else if(process.platform === 'darwin')
            return macos;
        else
            return linux
    }

    async function closeReader(){
        await fs.close(self.fd);
    }

    return {
        readNextChar: readNextChar,
        readNextLine: readNextLine,
        closeReader: closeReader
    };
}

function readLinesStartToEnd(file_path, bChunk = 1, dir = eDir.StartToEnd){
    var options = {};
    options.bChunk = bChunk;
    options.dir = dir;
    return readLines(file_path, options);
}

function readLinesEndToStart(file_path, bChunk = 1, dir = eDir.EndToStart){
    var options = {};
    options.bChunk = bChunk;
    options.dir = dir;
    return readLines(file_path, options);
}

module.exports = {
    readLinesStartToEnd: readLinesStartToEnd,
    readLinesEndToStart: readLinesEndToStart,
};
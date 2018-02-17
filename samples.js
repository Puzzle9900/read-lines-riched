var file_path = './test/lines'

function sample1() {

    const readLinesEndToStart = require("./main").readLinesEndToStart(file_path);

    var func = function () {
        readLinesEndToStart.readNextLine().then(line => {
            if (line) {
                console.log(line);
                func()
            } else
                readLinesEndToStart.closeReader();
        });
    };
    func();
}

function sample2() {

    const readLinesStartToEnd = require("./main.js").readLinesStartToEnd(file_path);

    (async function () {
        var line;
        while (line = await readLinesStartToEnd.readNextLine()) {
            console.log(line);
        }

        readLinesStartToEnd.closeReader();
    })();

}

function sample3() {
    const readLinesRiched = require("./main").readLines(file_path, {
        bChunk: 1024,
        dir: 1
    });

    (async function () {
        var line;
        while (line = await readLinesRiched.readNextLine()) {
            console.log(line);
        }

        readLinesRiched.closeReader();
    })();
}


sample1();
sample2();
sample3();
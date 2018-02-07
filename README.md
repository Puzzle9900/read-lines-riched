# Read Lines Riched

Easy way to read file lines on two directions: from the beginning to the end and from the end to the beginning.

## Installing

```
npm install --save read-lines-riched
```

## Running the tests

```
npm test
```

## Usage with Promise

Reading lines example from the end of the file to the beginning.
```
const {readLinesEndToStart} = require("read-lines-riched");

let endToStartRL = readLinesEndToStart("./testing_file");

var func = function () {
    endToStartRL.readNextLine().then(line => {
        if (line) {
            console.log(line);
            func()
        }
        else
            endToStartRL.closeReader();
    });
};

func();
```
## Usage with Async Await

Reading lines example from the beginning of the file to the end.

```
const { readLinesStartToEnd} = require("read-lines-riched");

const startToEndRL = readLinesStartToEnd("./testing_file");

(async function(){
    var line = await startToEndRL.readNextLine();
    while(line)
    {
        console.log(line);
        line = await startToEndRL.readNextLine();
    }

    startToEndRL.closeReader();
})();
```

## Contributing

1. Fork it on Github [https://github.com/Puzzle9900/read-lines-riched](https://github.com/Puzzle9900/read-lines-riched)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

Copyright (c) 2018 [Puzzle9900](https://github.com/Puzzle9900)

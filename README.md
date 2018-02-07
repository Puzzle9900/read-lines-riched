# Read Lines Riched

Easy way to read files line by line on two directions: from the beginning to the last and from the last to beginning.

## Installing

```
npm install --save read-lines-riched
```

## Running the tests

```
npm test
```

## Usage

To use the module.
```
const {readLinesStartToEnd, readLinesEndToStart} = require('read-lines-riched');
```

To read lines from the begining of the file to the end.
```
const startToEndRL = readLinesStartToEnd(file_path);
const line = await startToEndRL.readNextLine();
```
To read lines from the end of the file to the beginning.
```
let endToStartRL = readLinesEndToStart(file_path);
const line = await endToStartRL.readNextLine();
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

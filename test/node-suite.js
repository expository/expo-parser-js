"use strict";

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

var mocha = new Mocha;

fs.readdirSync('./test/spec').filter(function(file){
    return file.substr(-3) === '.js';

}).forEach(function(file){
    mocha.addFile(
        path.join('./test/spec', file)
    );
});

// Now, you can run the tests.
mocha.run(function(failures){
    process.on('exit', function () {
        process.exit(failures);
    });
});

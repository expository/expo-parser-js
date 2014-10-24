"use strict";

var Mocha = require('mocha');

var mocha = new Mocha({ui: 'bdd', reporter: 'spec'});
mocha.addFile('./test/spec/boilerplate-spec.js');

mocha.run(function(failures){
    process.exit(failures);
});

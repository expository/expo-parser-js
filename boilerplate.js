"use strict";

function boilerplate() {
    var something = require('./lib/something');
    return something.go ? 'all systems GO' : 'NO-GO';
}

module.exports = boilerplate;

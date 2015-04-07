"use strict";
(function () {

    // node.js
    if (typeof module != 'undefined') {
        module.exports = boilerplate;
    }

    // browser
    if (typeof window != 'undefined') {
        !window.boilerplate && (window.boilerplate = boilerplate);
    }

    function boilerplate() {
        var something = require('./lib/something');    
        return something.go ? 'all systems GO' : 'NO-GO';
    }

}());

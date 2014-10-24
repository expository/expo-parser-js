"use strict";

var boilerplate;

var expect;

if (typeof require == 'function') {
    boilerplate = require('../../boilerplate.js');

    expect = require('chai').expect;
}

describe('smoke test', function () {
    it('should pass', function () {
        expect(boilerplate()).to.equal('boilerplate');
    });
});

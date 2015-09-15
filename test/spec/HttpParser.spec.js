'use strict'

var HttpParser = require('../..').HttpParser

var expect = require('chai').expect

describe('HttpParser', function () {
  var parser = new HttpParser()
  describe('parsing requests', function () {
    it('should get the Method GET', function () {
      var result = parser.parseRequest('GET / HTTP/1.1')
      expect(result.method).to.equal('GET')
    })
    it('should get the Method POST', function () {
      var result = parser.parseRequest('POST / HTTP/1.1')
      expect(result.method).to.equal('POST')
    })
  })
})

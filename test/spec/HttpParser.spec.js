'use strict'

var HttpParser = require('../..').HttpParser

var expect = require('chai').expect

describe('HttpParser', function () {
  var parser = new HttpParser()
  describe('parsing requests', function () {
    it('gets the Method GET', function () {
      var result = parser.parseRequest('GET / HTTP/1.1')
      expect(result.method).to.equal('GET')
    })
    it('gets the Method POST', function () {
      var result = parser.parseRequest('POST / HTTP/1.1')
      expect(result.method).to.equal('POST')
    })
    it('finds the request URI', function () {
      var result = parser.parseRequest('PUT /some/fun/uri?with=query&param HTTP/1.1')
      expect(result.uri).to.equal('/some/fun/uri?with=query&param')
    })
    it('gives the protocol, if present', function () {
      var result = parser.parseRequest('DELETE /a/thing HTTP/1.1')
      expect(result.httpVersion).to.equal('HTTP/1.1')
    })
    it("doesn't require an HTTP version, for simplicity", function () {
      var result = parser.parseRequest('DELETE /a/thing')
      expect(result.httpVersion).to.be.undefined
    })
    it('can deal with extra spaces, if present', function () {
      var result = parser.parseRequest(' OPTIONS  /the/thing  HTTP/1.0 ')
      expect(result.method).to.equal('OPTIONS')
      expect(result.uri).to.equal('/the/thing')
      expect(result.httpVersion).to.equal('HTTP/1.0')
    })
  })
})

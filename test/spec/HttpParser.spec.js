'use strict'

var HttpParser = require('../..').HttpParser

var expect = require('chai').expect

describe('HttpParser', function () {
  var parser = new HttpParser()
  describe('parsing requests', function () {
    describe('request line', function () {
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
        expect(result.hasOwnProperty('httpVersion')).to.be.false
      })
      it('can deal with extra spaces, if present', function () {
        var result = parser.parseRequest(' OPTIONS  /the/thing  HTTP/1.0 ')
        expect(result.method).to.equal('OPTIONS')
        expect(result.uri).to.equal('/the/thing')
        expect(result.httpVersion).to.equal('HTTP/1.0')
      })
    })

    describe('headers', function () {
      it('gets simple key: value pairs', function () {
        var result = parser.parseRequest('GET /\ncontent-type: text/html\nconnection: keep-alive\n')
        expect(result.headers).to.deep.equal(
          {'content-type': 'text/html',
          'connection': 'keep-alive'}
        )
      })
      it('converts names to lowercase, since they are case-insensitive', function () {
        var result = parser.parseRequest('GET /\nContent-Type: application/json\nAccept: *')
        expect(result.headers).to.deep.equal({'content-type': 'application/json', 'accept': '*'})
      })
      it('trims extra spaces', function () {
        var result = parser.parseRequest('GET /\n  Accept    :  text/html    \nServer:foo\n')
        expect(result.headers).to.deep.equal({'accept': 'text/html', 'server': 'foo'})
      })
    // TODO: Mutli-valued headers combined with commas
    // TODO: Any validation at all?
    // TODO: line continuation in header values
    })

    describe('body', function () {
      it('gets the body content as-is', function () {
        var result = parser.parseRequest('POST /\naccept:*\n\nThe body content')
        expect(result.body).to.equal('The body content')
      })
      it("doesn't split the body across empty lines", function () {
        var result = parser.parseRequest('PUT /\n\nFirst line\n\nSecond line')
        expect(result.body).to.equal('First line\n\nSecond line')
      })
    })

    it('also works with CRLF line breaks', function () {
      var result = parser.parseRequest('HEAD /blah HTTP/1.1\r\naccept:*\r\ndate:today\r\n\r\nBody is a wonderland')
      expect(result.method).to.equal('HEAD')
      expect(result.uri).to.equal('/blah')
      expect(result.httpVersion).to.equal('HTTP/1.1')
      expect(result.headers).to.deep.equal({'accept': '*', 'date': 'today'})
      expect(result.body).to.equal('Body is a wonderland')
    })
  })
})

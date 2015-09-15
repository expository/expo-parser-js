'use strict'

require('es6-promise').polyfill()

var htmlparser = require('htmlparser2')
var DomUtils = htmlparser.DomUtils
var assign = require('lodash.assign')

module.exports = {
  parseHTML: parseHTML,
  HttpParser: HttpParser
}

function parseHTML (html) {
  return getDOM(html)
    .then(findCodeBlocks)
    .then(getTextContent)
    .then(parseRequestResponsePairs)
}

function getDOM (html) {
  return new Promise(function (resolve, reject) {
    var handler = new htmlparser.DomHandler(function (error, dom) {
      if (error) {
        reject(error)
      } else {
        resolve(dom)
      }
    }, {normalizeWhitespace: false})
    var parser = new htmlparser.Parser(handler, {decodeEntities: true})
    parser.write(html)
    parser.done()
  })
}

function findCodeBlocks (dom) {
  return DomUtils.filter(function (element) {
    return element.name === 'code' &&
    element.parent.name === 'pre'
  }, dom)
}

function getTextContent (elements) {
  return elements.map(function (element) {
    var text = DomUtils.getText(element)
    return cleanLeadingSpacesAndNormalizeLineBreaks(text)
  })
}

function cleanLeadingSpacesAndNormalizeLineBreaks (text) {
  return text.replace(/^\s*|\r/g, '')
}

function parseRequestResponsePairs (textBlocks) {
  var pairs = []
  for (var i = 0, length = textBlocks.length; i < length; i += 2) {
    var requestBlock = textBlocks[i]
    var responseBlock = textBlocks[i + 1]
    pairs.push({
      request: requestBlock,
      response: responseBlock
    })
  }
  return pairs
}

function HttpParser () {}
HttpParser.prototype.parseRequest = function (requestText) {
  var request = {}

  var regex = /^([^]*?)(?:\n\n([^]*))?$/g
  var split = regex.exec(requestText)
  var preamble = split[1]
  var body = split[2]

  var lines = preamble.trim().split(/\n/)
  var firstLine = lines.shift()
  assign(request, parseRequestLine(firstLine))
  request.headers = parseHeaders(lines)
  if (body) request.body = body
  return request

  function parseRequestLine (line) {
    var requestLine = line.trim().split(/ +/)
    var result = {
      method: requestLine[0],
      uri: requestLine[1]
    }
    if (requestLine[2]) result.httpVersion = requestLine[2]
    return result
  }

  function parseHeaders (headerLines) {
    var headers = {}
    var headerRegex = /\s*\:\s*/
    for (var i = 0; i < headerLines.length; i++) {
      var header = headerLines[i].split(headerRegex)
      headers[header[0].toLowerCase()] = header[1]
    }
    return headers
  }
}

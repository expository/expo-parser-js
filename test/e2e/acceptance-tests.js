"use strict";

var expect = require('chai').expect;
var fs = require('fs');

var parseHTML = require('../../src/expo-parser').parseHTML;

xdescribe('The Expo format spec', function(){

	/*
		```html
		HTML source
		```
		```json
		expected JSON output
		```
	*/
	var specText = fs.readFileSync(__dirname + '/expo-format/spec.txt', 'utf8')
	var regex = /\n```html\s*\n([\s\S]+)\n```\s*\n```json\s*\n([\s\S]+)\n```\s*\n/g

	var match;
	var index = 0;
	while ((match = regex.exec(specText)) != null) {
		index++
		var inputHTML = match[1];
		var expectedJSON = match[2];
		var expectedObject = JSON.parse(expectedJSON);

		it('example ' + index, function(done){
			parseHTML(inputHTML).then(function(result){
				expect(result).to.deep.equal(expectedObject);
			}).then(done, done);
		});
	}

});

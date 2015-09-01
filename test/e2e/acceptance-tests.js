"use strict";

var expect = require('chai').expect;
var fs = require('fs');

describe('The Expo format spec', function(){

	var specText = fs.readFileSync(__dirname + '/expo-format/spec.txt', 'utf8')
	var regex = /\n```html\s*\n([\s\S]+)\n```\s*\n```json\s*\n([\s\S]+)\n```\s*\n/g

	var match;
	var index = 0;
	while ((match = regex.exec(specText)) != null) {
		index++
		var inputHTML = match[1];
		var expectedJSON = match[2];

		xit('example ' + index, function(){
			expect(inputHTML).to.equal(inputHTML);
		});
	}

});

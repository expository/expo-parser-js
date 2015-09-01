"use strict";

var expect = require('chai').expect;
var fs = require('fs');

describe('The Expo format examples', function(){

	var specText = fs.readFileSync(__dirname + '/expo-format/spec.txt');

	console.log(specText);

});

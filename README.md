custom-hash [![Build Status](https://travis-ci.org/Belema/custom-hash.svg?branch=master)](https://travis-ci.org/Belema/custom-hash)
===========

custom-hash lets you create (very) customisable hashes of 128 bits or less.

Main use case
-------------
Deterministically creating a hash of a limited length, using a defined set of characters.

	var hash = require('custom-hash');
	hash.configure({ charSet: [ 'A', 'B', 'C', 'D', 'E', 'F' ], maxLength: 10 });

	hash.digest('Hello World');
	-> 'BECFBFECAD'

	hash.digest('Hello World!');
	-> 'CCABBACAEE'

Configuration
-------------
Without customisation, custom-hash is just an inefficient way of generating an MD5 hash. 

	hash.digest('Hello World!');
	-> 'ed076287532e86365e841e92bfc50d8c'

Converting the MD5 hash to a different base is done by changing the number of characters in the `charSet` config property.

	hash.configure({ charSet: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ] });
	hash.digest('Hello World!');
	-> '315065379476721403163906509030895717772'
 
Shortening the output is achieved by decreasing the value of the `maxLength` config property.

	hash.configure({ maxLength: 10 });
	hash.digest('Hello World!');
	-> 'ed07628753'

Choosing the part of the hash to use is achieved by setting `right` to `true` in the config.

	hash.configure({ right: true, maxLength: 10 });
	hash.digest('Hello World!');
	-> '92bfc50d8c'

Default config values
---------------------

They are,

	var DEFAULTS = {
	    charSet: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ],
	    maxLength: 128,
	    right: false
	};

A parameterless call to the function `configure` resets the configuration to its default values.
 
	var hash = require('custom-hash');
	hash.configure();

Contributing
-------------
Please run the following commands before submitting a pull-request,

	npm run lint
	npm run code-style
	npm run test

findhit-class
=============

javascript class framework

Used for fast deploying of classes by inheriting existent ones.

## Instalation

```bash
npm install findhit/findhit-class --save
```

## Usage

```js

var Class = require('findhit-class');

// Class creation by extending Class

var MyClass = Class.extend({

	initialize: function ( arg1, arg 2 ) {
		return this || false;
	},

	destroy: function () {
		return;
	},

	test: function () {
		return 'test';
	},

});


// Extending MyClass to a new Class
// Inheriting initialize and destroy function

var MyNewClass = MyClass.extend({

	test: function () {
		return 'cool';
	},	

});

	// Since we want to inherite initialize, we may also add an hook for this class
	MyNewClass.addInitHook(function () {

		// do something here..

	});

	// And also for destroying
	MyNewClass.addDestroyHook(function () {

		// do something here..

	});

```

## Thanks

Huge thanks to [Leaflet](https://github.com/Leaflet/Leaflet/blob/master/src/core/Class.js), [John Resig](http://ejohn.org/blog/simple-javascript-inheritance/) and [Dean Edwards](http://dean.edwards.name/weblog/2006/03/base/).
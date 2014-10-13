# Class ![test-badge](http://strider.findhit.com/findhit/findhit-class/badge)

javascript class framework

Used for fast deploying of classes by inheriting existent ones.

## Instalation

```bash

	npm install findhit-class --save

```

## Usage

```js
var Class = require('findhit-class');
```

### Features

#### Extendable
```js
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

```

#### Hookable
```js
	// Since we want to inherite initialize, we may also add an hook for this class
	MyClass.addInitHook(function () {

		// do something here..

	});

	// And also for destroying
	MyClass.addDestroyHook(function () {

		// do something here..

	});

	// WARNING:
	// Hooks also run on parent classes when an instance is constructed!

```

#### Associable
```js
	// Initialize some vars
	var Gun = Class.extend(),
		Bullet = Class.extend();

	// Associating them
	Gun.hasMany( 'Bullets', Bullet );
	Bullet.belongsTo( 'Gun', Gun );

	// Creating instances
	var gun = new Gun( 'colt' ),
		bulletOne = new Bullet( 'alpha' ),
		bulletStupid = new Bullet( 'whoote' ),
		bulletKaeda = new Bullet( 'i kill you' );

	// We could associate on multiple ways:

		// From a bullet pov

			bulletOne.Gun = gun;
			// gun.Bullets should be now equal to [ bulletOne ];


		// From a gun pov

			gun.Bullets = [ bulletOne, bulletStupid, bulletKaeda ];
			gun.setBullets( [ bulletOne, bulletStupid, bulletKaeda ] );

			// bulletOne.Gun, bulletStupid.Gun and bulletKaeda.Gun should be now equal to Gun

```

#### Optionable
```js
	// Initialize some vars
	var Gun = Class.extend({
			options: {
				silent: false,
			},
		});

	var Colt = Gun.extend({
			options: {
				silent: true,
				color: undefined,
				model: undefined,
			},
		});

	var gun = new Gun(),
		colt = new Colt();

	gun.options; // { silent: false }
	colt.options; // { silent: true, color: undefined, model: undefined }

```

## Thanks

Huge thanks to [Leaflet](https://github.com/Leaflet/Leaflet/blob/master/src/core/Class.js), [John Resig](http://ejohn.org/blog/simple-javascript-inheritance/) and [Dean Edwards](http://dean.edwards.name/weblog/2006/03/base/).

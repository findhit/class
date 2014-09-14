var Class = require( '../index' ),
	Util = require( 'findhit-util' ),

	sinon = require( 'sinon' ),
	chai = require( 'chai' ),
	expect = chai.expect;

describe( "Class", function () {
	
	describe( "prototype", function () {
		var Example,
			constructor,
			method;

		beforeEach(function () {
			constructor = sinon.spy();
			method = sinon.spy();

			Example = Class.extend({
				statics: {bla: 1},
				includes: {mixin: true},

				options: {
					foo: 'bar',
					hello: 'world',
				},

				initialize: constructor,
				foo: 5,
				bar: method
			});
		});

		it( "from within an instance", function () {
			var instance = new Example();

			expect( instance.options ).to.deep.equal({
				foo: 'bar',
				hello: 'world',
			});

			instance.setOptions({ foo: 'car' });

			expect( instance.options ).to.deep.equal({
				foo: 'car',
				hello: 'world',
			});

			instance.setOptions({ hello: 'girls' });

			expect( instance.options ).to.deep.equal({
				foo: 'car',
				hello: 'girls',
			});

		});

		it( "Check if latest test unit didn't changed prototype", function () {
			var instance = new Example();

			expect( instance.options ).to.deep.equal({
				foo: 'bar',
				hello: 'world',
			});
		});

	});

});
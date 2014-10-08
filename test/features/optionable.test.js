var Class = require( '../../index' ),
    Util = require( 'findhit-util' ),

    sinon = require( 'sinon' ),
    chai = require( 'chai' ),
    expect = chai.expect;

describe("Class", function () {

    describe("features", function () {

        describe("optionable", function () {

            var Example,
                constructor,
                method;

            beforeEach(function () {
                constructor = sinon.spy();
                method = sinon.spy();

                Example = Class.extend({
                    statics: {bla: 1},
                    includes: {mixin: true},

                    initialize: constructor,
                    foo: 5,
                    bar: method
                });
            });

            it("merges options instead of replacing them", function () {
                var ExampleWithOptions1 = Class.extend({
                    options: {
                        foo1: 1,
                        foo2: 2
                    }
                });
                var ExampleWithOptions2 = ExampleWithOptions1.extend({
                    options: {
                        foo2: 3,
                        foo3: 4
                    }
                });

                var a = new ExampleWithOptions2();
                expect( a.options.foo1 ).to.eql(1);
                expect( a.options.foo2 ).to.eql(3);
                expect( a.options.foo3 ).to.eql(4);
            });

            it("gives new classes a distinct options object", function () {
                var K1 = Class.extend({options: {}});
                var K2 = K1.extend({});
                expect( K2.prototype.options).not.to.equal(K1.prototype.options);
            });

            it("inherits options prototypally", function () {
                var K1 = Class.extend({options: {}});
                var K2 = K1.extend({options: {}});
                K1.prototype.options.foo = 'bar';
                expect( K2.prototype.options.foo ).to.eql('bar');
            });

        });

    });

});

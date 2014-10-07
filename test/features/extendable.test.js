var Class = require( '../../index' ),
    Util = require( 'findhit-util' ),

    sinon = require( 'sinon' ),
    chai = require( 'chai' ),
    expect = chai.expect;

describe("Class", function () {

    describe("features", function () {

        describe("extendable", function () {

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

            it("creates a class with the given constructor & properties", function () {
                var a = new Example();

                expect( constructor.called ).to.be.ok;
                expect( a.foo ).to.eql(5);

                a.bar();

                expect( method.called ).to.be.ok;
            });

            it("inherits parent classes' constructor & properties", function () {
                var Example2 = Example.extend({baz: 2});

                var b = new Example2();

                expect( b instanceof Example ).to.be.ok;
                expect( b instanceof Example2 ).to.be.ok;

                expect( constructor.called ).to.be.ok;
                expect( b.baz ).to.eql(2);

                b.bar();

                expect( method.called ).to.be.ok;
            });

            it("supports static properties", function () {
                expect( Example.bla ).to.eql(1);
            });

            it("inherits parent static properties", function () {
                var Example2 = Example.extend({});

                expect( Example2.bla ).to.eql(1);
            });

            it("overrides parent static properties", function () {
                var Example2 = Example.extend({statics: {bla: 2}});

                expect( Example2.bla ).to.eql(2);
            });

            it("includes the given mixin", function () {
                var a = new Example();
                expect( a.mixin ).to.be.ok;
            });

            it("includes multiple mixins", function () {
                var Example2 = Class.extend({
                    includes: [{mixin: true}, {mixin2: true}]
                });
                var a = new Example2();

                expect( a.mixin ).to.be.ok;
                expect( a.mixin2 ).to.be.ok;
            });

            it("grants the ability to include the given mixin", function () {
                Example.include({mixin2: true});

                var a = new Example();
                expect( a.mixin2 ).to.be.ok;
            });

        });

    });

});

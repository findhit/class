var Class = require( '../../index' ),
    Util = require( 'findhit-util' ),

    sinon = require( 'sinon' ),
    chai = require( 'chai' ),
    expect = chai.expect;

describe("Class", function () {

    describe("features", function () {

        describe("hookable", function () {

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

            it("adds constructor hooks correctly", function () {
                var spy1 = sinon.spy();

                Example.addInitHook(spy1);
                Example.addInitHook('bar', 1, 2, 3);

                var a = new Example();

                expect( spy1.called ).to.be.ok;
                expect( method.calledWith(1, 2, 3));
            });

            it("inherits constructor hooks", function () {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy();

                var Example2 = Example.extend({});

                Example.addInitHook(spy1);
                Example2.addInitHook(spy2);

                var a = new Example2();

                expect( spy1.called ).to.be.ok;
                expect( spy2.called ).to.be.ok;
            });

            it("does not call child constructor hooks", function () {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy();

                var Example2 = Example.extend({});

                Example.addInitHook(spy1);
                Example2.addInitHook(spy2);

                var a = new Example();

                expect( spy1.called ).to.be.ok;
                expect( spy2.called ).to.eql( false );
            });

        });

    });

});

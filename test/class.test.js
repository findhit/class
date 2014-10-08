var Class = require( '../index' ),
    Util = require( 'findhit-util' ),

    sinon = require( 'sinon' ),
    chai = require( 'chai' ),
    expect = chai.expect;

describe("Class", function () {

    describe("construction", function () {

        beforeEach( function () {

            this.Error = Class.extend({
                initialize: function ( data ) {
                    this.data = data;
                },
                stack: function () {
                    return this.data;
                },
            });

        });

        it( "using new", function () {
            var error = new this.Error( 'yolo' );

            expect( error.constructor ).to.be.equal( this.Error );
            expect( error.stack() ).to.be.equal( 'yolo' );

        });

        it( "using .construct", function () {
            var error = this.Error.construct( 'yolo' );

            expect( error.constructor ).to.be.equal( this.Error );
            expect( error.stack() ).to.be.equal( 'yolo' );

        });

        it( "using function directly", function () {
            var error = this.Error( 'yolo' );

            expect( error.constructor ).to.be.equal( this.Error );
            expect( error.stack() ).to.be.equal( 'yolo' );

        });

    });

});

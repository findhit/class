var Class = require( '../../index' ),
    Util = require( 'findhit-util' ),

    sinon = require( 'sinon' ),
    chai = require( 'chai' ),
    expect = chai.expect;

describe("Class", function () {

    describe("features", function () {

        describe("associable", function () {

            beforeEach(function () {

                this.Alpha = Class.extend({});
                this.Bravo = Class.extend({});
                this.Charlie = Class.extend({});
                this.Delta = Class.extend({});

            });

            describe( "1:1", function () {

                beforeEach(function() {

                    this.Alpha.hasOne( 'Johny', this.Bravo );
                    this.Bravo.belongsTo( 'Alpha', this.Alpha );

                });

                describe( "not associated yet should return null on", function () {

                    it( "variables scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Test if they are reachable on both scopes
                        expect( alpha.Johny ).to.be.equal( null );
                        expect( bravo.Alpha ).to.be.equal( null );

                    });

                    it( ".get/.set methods scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Test if they are reachable on both scopes
                        expect( alpha.getJohny() ).to.be.equal( null );
                        expect( bravo.getAlpha() ).to.be.equal( null );

                    });

                });

                describe( "already set should return them on", function () {

                    it( "variables scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Link them
                        alpha.Johny = bravo;

                        // Test if they are reachable on both scopes
                        expect( alpha.Johny ).to.be.equal( bravo );
                        expect( bravo.Alpha ).to.be.equal( alpha );

                    });

                    it( ".get/.set methods scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Link them
                        alpha.setJohny( bravo );

                        // Test if they are reachable on both scopes
                        expect( alpha.getJohny() ).to.be.equal( bravo );
                        expect( bravo.getAlpha() ).to.be.equal( alpha );

                    });

                });

            });

            describe( "1:M", function () {

                beforeEach(function() {

                    this.Alpha.hasMany( 'Johnies', this.Bravo );
                    this.Bravo.belongsTo( 'Alpha', this.Alpha );

                });

                describe( "not associated yet should return null or empty array on", function () {

                    it( "variables scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Test if they are reachable on both scopes
                        expect( alpha.Johnies ).to.be.deep.equal( [] );
                        expect( bravo.Alpha ).to.be.equal( null );

                    });

                    it( ".get method scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Test if they are reachable on both scopes
                        expect( alpha.getJohnies() ).to.be.deep.equal( [] );
                        expect( bravo.getAlpha() ).to.be.equal( null );

                    });

                });

                describe( "already set should return them on", function () {

                    it( "variables scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Link them
                        alpha.Johnies = [ bravo ];

                        // Test if they are reachable on both scopes
                        expect( alpha.Johnies ).to.be.deep.equal( [ bravo ] );
                        expect( bravo.Alpha ).to.be.equal( alpha );

                    });

                    it( ".set/.get methods scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Link them
                        alpha.setJohnies( [ bravo ] );

                        // Test if they are reachable on both scopes
                        expect( alpha.getJohnies() ).to.be.deep.equal( [ bravo ] );
                        expect( bravo.Alpha ).to.be.equal( alpha );

                    });

                    it( ".add/.get methods scopes", function () {

                        var alpha = new this.Alpha(),
                            bravo = new this.Bravo();

                        // Link them
                        alpha.addJohnies( [ bravo ] );

                        // Test if they are reachable on both scopes
                        expect( alpha.getJohnies() ).to.be.deep.equal( [ bravo ] );
                        expect( bravo.Alpha ).to.be.equal( alpha );

                    });

                });

            });

            describe( "N:M", function () {

            });

            describe( "internal tests to make development faster", function () {

                beforeEach(function() {

                    this.Alpha.hasMany( 'Johnies', this.Bravo );
                    this.Bravo.belongsTo( 'Alpha', this.Alpha );

                    this.Alpha.hasMany( 'Charlies', this.Charlie );
                    this.Charlie.hasMany( 'Alphas', this.Alpha );

                });

                describe( ".getAssociations", function () {

                    beforeEach(function () {
                        this.alpha_to_bravo_association = this.Alpha.associations.get( this.Bravo );
                        this.bravo_to_alpha_association = this.Bravo.associations.get( this.Alpha );
                    });

                    it( "associations shouldn't be undefined neither null", function () {
                        expect( this.alpha_to_bravo_association ).to.be.ok;
                        expect( this.bravo_to_alpha_association ).to.be.ok;
                    });

                    it( "Check if targetAssociation's are correct", function () {
                        expect( this.alpha_to_bravo_association.targetAssociation ).to.be.equal( this.bravo_to_alpha_association );
                        expect( this.bravo_to_alpha_association.targetAssociation ).to.be.equal( this.alpha_to_bravo_association );
                    });

                });

            });
        });

    });

});

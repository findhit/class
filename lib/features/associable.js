module.exports = function ( Class ) {
    var Util = require( 'findhit-util' );

    /*
     * N:M :
     *  ClassA.hasMany( ClassB, 'B' );
     *  ClassB.hasMany( ClassA, 'A' );
     *
     * 1:M :
     *  ClassA.hasMany( ClassB, 'B' );
     *  ClassB.belongsTo( ClassA, 'A' );
     *
     * 1:1 :
     *  ClassA.hasOne( ClassB, 'B' );
     *  ClassB.belongsTo( ClassA, 'A' );
     *
     */

    Class.hasMany = function ( alias, TargetClass ) {
        return this.associate( alias, TargetClass, Infinity );
    };

    Class.hasOne = function ( alias, TargetClass ) {
        return this.associate( alias, TargetClass, 1 );
    };

    Class.belongsTo = function ( alias, TargetClass ) {
        return this.associate( alias, TargetClass, 1 );
    };

    // Backbone of association

    Class.associate = function ( alias, TargetClass, type ) {
        var association = this.associations.get( TargetClass );

        if ( association ) {
            return false;
        }

        return new Association( this, TargetClass, alias, type );
    };

    Class.deassociate = function ( TargetClass ) {
        var association = this.associations.get( TargetClass );

        if ( ! association ) {
            return false;
        }

        association.unbind();

        if( association.targetAssocation ) {
            association.targetAssociation.unbind();
            association.unbindTargetAssociation();
        }

        return true;
    };

    // Associations

    var Association = function ( source, target, alias, type ) {

        if (
            Util.isnt.Class( source ) ||
            Util.isnt.Class( target ) ||
            Util.isnt.String( alias ) || ! alias ||
            Association.types.indexOf( type ) === -1
        ) {
            return false;
        }

        this.id = Util.uniqId();
        this.source = source;
        this.target = target;
        this.alias = Util.String.capitalize( alias );
        this.type = type;

        return this.complete();
    };

    // Implementation into Class
    var origExtend = Class.extend;
    Class.extend = function ( props ) {
        var NewClass = origExtend.apply( this, arguments ),
            parent = NewClass.parent.prototype;

        if ( typeof NewClass !== 'function' ) {
            return NewClass;
        }

        // Create associations prototyped from parentProto or a new object
        var associations = parent && parent.associations ? ClassUtil.create( parent.associations ) : {};

        Object.defineProperty( NewClass, 'associations', {
            enumerable: false,
            writable: true,
            value: associations,
        });

        // Inject a protected getter
        Object.defineProperty( associations, "get", {
            enumerable: false,
            writable: false,
            value: Association._get.bind( associations ),
        });

        return NewClass;
    };

    Association._get = function ( from ) {
        var filtered;

        if ( ! from ) {
            return false;
        }

        // Check if it is an Alias
        if ( Util.is.String( from ) ) {
            return this[ from ] || false;
        }

        // Check for target
        if ( Util.is.Class( from ) ) {
            filtered = Util.filter( this, function ( association ) {
                return association.target === from;
            });

            return filtered[ Object.keys( filtered )[ 0 ] ] || false;
        }

        // Check for association
        if ( Util.is.instanceof( Association, from ) ) {
            filtered = Util.filter( this, function ( association ) {
                return association === from || association.targetAssociation === from;
            });

            return filtered[ Object.keys( filtered )[ 0 ] ] || false;
        }

        // In last case...
        return false;
    };

    Association.types = [
        1,
        Infinity
    ];

    Association.prototype.complete = function () {
        if( this.completed ) return this;

        this.bind();
        this.bindTargetAssociation();

        if( ! this.targetAssociation ) {
            return this;
        }

        this.completed = true;

        // Try to complete again targetAssociation
        this.targetAssociation.complete();

        // Inject this side getter and setter
        this.injectSourceGetterAndSetter();

        return this;
    };

    Association.prototype.bindTargetAssociation = function () {
        this.targetAssociation = this.target.associations.get( this.source );

        if ( this.targetAssociation ) {
            this.targetAssociation.targetAssociation = this;
        }
    };

    Association.prototype.unbindTargetAssociation = function () {

        if ( this.targetAssociation ) {
            this.targetAssociation.targetAssociation = null;
        }

        this.targetAssociation = false;
    };

    Association.prototype.bind = function () {
        this.source.associations[ this.alias ] = this;
    };

    Association.prototype.unbind = function () {
        delete this.source.associations[ this.alias ];
    };

    Association.prototype.injectSourceGetterAndSetter = function () {
        if ( this.alreadyInjected ) {
            return false;
        }

        var association = this,
            resetter, getter, setter, adder, remover;

        switch( this.type ) {

            case 1:

                resetter = this.source.prototype[ 'reset' + this.alias ] = function () {
                    var connector = this.connectors.get( association );

                    connector.clear();

                    return true;
                };

                getter = this.source.prototype[ 'get' + this.alias ] = function () {
                    var connector = this.connectors.get( association );

                    return connector.get( 0 );
                };

                setter = this.source.prototype[ 'set' + this.alias ] = function ( instance ) {
                    if ( ! instance || Util.isnt.instanceof( association.target, instance ) ) {
                        return false;
                    }

                    // Grab connector and remoteConnector
                    var connector = this.connectors.get( association ),
                        remoteConnector = instance.connectors.get( association.targetAssociation );

                    // Try to arrange this into remote connector
                    if ( remoteConnector ) {
                        if( remoteConnector.association.type === 1 ) {
                            remoteConnector.clear();
                        }

                        remoteConnector.add( this );
                    }

                    connector.clear();
                    return connector.add( instance );
                };


            break;

            case Infinity:

                resetter = this.source.prototype[ 'reset' + this.alias ] = function () {
                    var connector = this.connectors.get( association );

                    connector.clear();

                    return true;
                };

                getter = this.source.prototype[ 'get' + this.alias ] = function ( i ) {
                    var connector = this.connectors.get( association );

                    return connector.get( i );
                };

                setter = this.source.prototype[ 'set' + this.alias ] = function ( instances ) {
                    var self = this;

                    // HEY, CHECK THIS FUCKING OUT!!!
                    // Easy way, remove all current instances by running get with current instance binded
                    (remover.bind( self ))( (getter.bind( self ))() || [] );

                    // Then map instances we want to set and run add with current instance binded
                    return (adder.bind( self ))( instances );
                };

                adder = this.source.prototype[ 'add' + this.alias ] = function ( instances ) {
                    var self = this;
                    return Util.map( instances, function ( instance ) {
                        if ( ! instance || Util.isnt.instanceof( association.target, instance ) ) {
                            return false;
                        }

                        // Grab connector and remoteConnector
                        var connector = self.connectors.get( association ),
                            remoteConnector = instance.connectors.get( association.targetAssociation );

                        // Try to arrange this into remote connector
                        if ( remoteConnector ) {
                            if( remoteConnector.association.type === 1 ) {
                                remoteConnector.clear();
                            }

                            remoteConnector.add( self );
                        }

                        return connector.add( instance );
                    });
                };

                remover = this.source.prototype[ 'remove' + this.alias ] = function ( instances ) {
                    var self = this;
                    return Util.map( instances, function ( instance ) {
                        if ( ! instance || Util.isnt.instanceof( association.target, instance ) ) {
                            return false;
                        }

                        // Grab connector and remoteConnector
                        var connector = self.connectors.get( association ),
                            remoteConnector = instance.connectors.get( association.targetAssociation );

                        // Try to arrange this into remote connector
                        if ( remoteConnector ) {
                            if( remoteConnector.association.type === 1 ) {
                                remoteConnector.clear();
                            } else {
                                remoteConnector.remove( self );
                            }
                        }

                        return connector.remove( instance );
                    });
                };

            break;

        }

        // Now lets set global things :)

        association.source.addInitHook(function () {
            this.connectors[ association.alias ] = new Connector( association );

            // Property binding
            Object.defineProperty( this, association.alias, {
                enumerable: true,
                get: getter,
                set: setter,
            });

        });

        this.alreadyInjected = true;
        return true;
    };

    Association.prototype.removeSourceGettersAndSetters = function () {
        if ( ! this.alreadyInjected ) {
            return false;
        }

        this.alreadyInjected = false;
        return true;
    };

    // Connectors

    var Connector = function ( association ) {
        this.association = association;
        this.array = [];

        return this;
    };

    // Implementation into Class
    Class.addInitHook(function () {
        var connectors = {};

        Object.defineProperty( this, "connectors", {
            enumerable: false,
            writable: true,
            value: connectors,
        });

        // Inject a protected getter
        Object.defineProperty( connectors, "get", {
            enumerable: false,
            writable: false,
            value: Connector._get.bind( connectors ),
        });
    });

    Connector._get = function ( from ) {
        var filtered;

        // This should be used inside a connectors context, not Connector's Fn
        if( this === Connector ) {
            return false;
        }

        if ( ! from ) {
            return false;
        }

        // Check if it is an Alias
        if ( Util.is.String( from ) ) {
            return this[ from ] || false;
        }

        // Check for target
        if ( Util.is.Class( from ) ) {
            filtered = Util.filter( this, function ( connector ) {
                return connector.association.target === from;
            });

            return filtered[ Object.keys( filtered )[ 0 ] ] || false;
        }

        // Check for association
        if ( Util.is.instanceof( Association, from ) ) {
            filtered = Util.filter( this, function ( connector ) {
                return connector.association === from;
            });

            return filtered[ Object.keys( filtered )[ 0 ] ] || false;
        }

        // In last case...
        return false;
    };

    Connector.prototype.clear = function () {

        if ( this.array.length ) {
            this.array.splice( 0, this.array.length );
        }

        return true;
    };

    Connector.prototype.get = function ( i ) {

        // Force i if this is a only one
        if ( this.association.type === 1 ) {
            // Sorry, i whould be 0
            i = 0;
        }

        if ( Util.is.undefined( i ) ) {
            return this.array;
        }

        return this.array[ i ] || null;
    };

    Connector.prototype.add = function ( instance ) {

        // Dont add if it is currently present
        if ( this.array.indexOf( instance ) !== -1 ) {
            return false;
        }

        // Dont add if this is a One-to-something connection and we already have some
        if ( this.association.type === 1 && this.array.length ) {
            return false;
        }

        this.array.push( instance );

        return true;
    };

    Connector.prototype.remove = function ( i ) {

        // Accept a number as index, otherwise try to gess it by checking if it is present into the array
        i = Util.is.number( i ) && i > -1 && i < this.array.length ? i : this.array.indexOf( i );

        if ( i === -1 ) {
            return false;
        }

        this.array.splice( i, 1 );

        return true;
    };


};

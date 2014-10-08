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
        var association = this.getAssociation( alias );

        if( association ) {
            return false;
        }

        association = new Association( this, TargetClass, alias, type );
        this._associations[ alias ] = association;
        association.injectSourceGettersAndSetters();

        return association;
    };

    Class.deassociate = function ( alias ) {
        var association = this.getAssociation( alias );

        if( ! association ) {
            return false;
        }

        // deassociate from this class
        this._associations[ association.alias ] = null;

        // and from other also, only if it is directly associated
        // just because it could be an extension... :p

        if( association.targetAssociation ) {

            association.targetAssociation.unbind();

        }

        association.unbind();

        return true;

    };

    Class.getAssociation = function ( from ) {
        var association;

        if( ! from ) {
            return false;
        }

        // Check if it is an Alias
        if( Util.is.String( from ) ) {
            return this._associations[ from ] || false;
        }

        // Check for target
        if( Util.is.instanceof( Class, from ) ) {
            return Util.filter( this._associations, function ( association ) {
                return association.target === from;
            })[0] || false;
        }

        // Check for association
        if( Util.is.instanceof( Association, from ) ) {
            return Util.filter( this._associations, function ( association ) {
                return association === from;
            })[0] || false;
        }

        // In last case...
        return false;
    };

    Class.addInitHook(function () {
        Object.defineProperty( this, "associations", {
            enumerable: false,
            writable: true,
            value: {}
        });
    });

    var Connector = function ( association ) {
        this.association = association;
        this.array = [];

        return this;
    };

    Connector.prototype.add = function ( instance ) {
        if( this.array.indexOf( instance ) !== -1 ) {
            return false;
        }

        this.array.push( instance );

        return true;
    };

    Connector.prototype.remove = function ( instance ) {
        if( this.array.indexOf( instance ) === -1 ) {
            return false;
        }

        this.array.splice( this.array.indexOf( instance ), 1 );

        return true;
    };

    var Association = function ( source, target, alias, type ) {

        if(
            Util.isnt.instanceof( Class, source ) ||
            Util.isnt.instanceof( Class, target ) ||
            Util.isnt.String( Class, alias ) || ! alias ||
            Association.types.indexOf( type ) === -1
        ) {
            return false;
        }

        this.id = Util.uniqId();
        this.source = source;
        this.target = target;
        this.alias = Util.String.capitalize( alias );
        this.type = type;
        this.targetAssociation = null;

        return this;
    };

    Association.types = [
        1,
        Infinity
    ];

    Association.prototype.bindTargetAssociation = function () {
        this.targetAssociation = this.target.getAssociation( this.source );
    };

    Association.prototype.unbindTargetAssociation = function () {
        this.targetAssociation = false;
    };

    Association.prototype.bind = function () {
        this.source._associations[ this.alias ] = this;
    };

    Association.prototype.unbind = function () {
        delete this.source._associations[ this.alias ];
    };

    Association.prototype.injectSourceGettersAndSetters = function () {
        if( this.alreadyInjected ) {
            return false;
        }

        var association = this,
            resetter, getter, setter, adder, remover;

        this.source.addInitHook(function () {
            this.associations[ this.alias ] = new Connector( association );
        });

        switch( this.type ) {

            case 1:

                resetter = this.source.prototype[ 'reset' + this.alias ] = function () {
                    var instances = this.associations[ association.alias ];

                    this.associations[ association.alias ].clear();

                    return true;
                };

                getter = this.source.prototype[ 'get' + this.alias ] = function () {
                    return this.associations[ association.alias ].get( 0 );
                };

                setter = this.source.prototype[ 'set' + this.alias ] = function ( instance ) {
                    if( ! instance || Util.isnt.instanceof( this.target ) ) {
                        return false;
                    }

                    this.associations[ association.alias ].clear();
                    this.associations[ association.alias ].add( instance );

                    return true;
                };


            break;

            case Infinity:

                getter = this.source.prototype[ 'get' + this.alias ] = function () {

                };

                setter = this.source.prototype[ 'set' + this.alias ] = function () {

                };

                adder = this.source.prototype[ 'add' + this.alias ] = function () {

                };

                remover = this.source.prototype[ 'remove' + this.alias ] = function () {

                };

                this.source.addInitHook( 'reset' + this.alias );

            break;

        }

        this.alreadyInjected = true;
        return true;
    };

    Association.prototype.removeSourceGettersAndSetters = function () {
        if( ! this.alreadyInjected ) {
            return false;
        }

        this.alreadyInjected = false;
        return true;
    };


    var origExtend = Class.extend;
    Class.extend = function ( props ) {
        var NewClass = origExtend.apply( this, arguments ),
            parent = NewClass.parent.prototype;

        if( typeof NewClass !== 'function' ) {
            return NewClass;
        }

        // Create associations prototyped from parentProto or a new object
        NewClass._associations = parent && parent._associations ? ClassUtil.create( parent._associations ) : {};

        return NewClass;
    };

};

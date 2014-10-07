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

    Class.hasMany = function ( as, RelatedClass ) {
        return this.associate( as, RelatedClass, Infinity );
    };

    Class.hasOne = function ( as, RelatedClass ) {
        return this.associate( as, RelatedClass, 1 );
    };

    Class.belongsTo = function ( as, RelatedClass ) {
        return this.associate( as, RelatedClass, 1 );
    };

    // Backbone of association

    Class.associate = function ( as, RelatedClass, howMany ) {



    };

    Class.deassociate = function ( as ) {
        var association = this.getAssociation( as );

        if( ! association ) {
            return false;
        }

        // deassociate from this class
        this._associations[ association.as ] = null;

        // and from other also, only if it is directly associated
        // just because it could be an extension... :p
        var targetAssociation = association.target.getAssociation( this );
        if( targetAssociation ) {
            association.target._associations[ targetAssociation.as ] = null;
        }

        return true;

    };

    Class.getAssociation = function ( from ) {
        var association;

        if( ! from ) {
            return false;
        }

        if( Util.is.String( from ) ) {

        }

        if( Util.is.Function( from ) ) {

        }

        if( Util.is.instanceof( Association, from ) ) {
            
        }

    };

    var Association = function ( source, target, alias ) {

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

    };

};

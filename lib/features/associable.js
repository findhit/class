module.exports = function ( Class ) {

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

    Class.hasMany = function ( AnotherClass, as ) {

    };

    Class.hasOne = function ( AnotherClass, as ) {

    };

    Class.belongsTo = function ( AnotherClass, as ) {

    };

};

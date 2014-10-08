module.exports = function ( Class ) {
    var ClassUtil = require( './util' ),
        Util = require( 'findhit-util' );

    Class.construct = function () {
        return ClassUtil.construct( this, arguments );
    };

    // Register class as a checker
    Util.isisnt.registerCustom( 'Class', function ( variable ) {
        return variable.extend && ( variable.parent || variable === Class );
    });

};

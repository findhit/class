/**
  The entry point.
  @module Class
**/

/**
 * To use it, you just need to import it:
 *
 * ```js
 * var Class = require('findhit-class');
 * ```
 *
 *
 * @class Class
 */

var Class = function () {};

// Mixin extras
require( './lib/statics' )( Class );

// Mixin features
require( './lib/features/extendable' )( Class );
require( './lib/features/hookable' )( Class );
require( './lib/features/associable' )( Class );
require( './lib/features/optionable' )( Class );

module.exports = Class;

'use strict';

var Util = require('findhit-util');

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
module.exports = (function () {
	var Class = function () {};

	// Class Static Methods

		Class.extend = function (props) {

			// extended class with the new prototype
			var NewClass = function () {
				var r;

				// Recall as new if new isn't provided :)
				if( ! ( this instanceof NewClass ) )
					return Class.Util.construct( NewClass, arguments );

				// call the constructor
				if (this.initialize) {
					r = this.initialize.apply(this, arguments);
				}

				// call all constructor hooks
				this.callInitHooks();

				return typeof r != 'undefined' ? r : this;
			};

			// jshint camelcase: false
			var parentProto = NewClass.__super__ = this.prototype;

			var proto = Class.Util.create(parentProto);
			proto.constructor = NewClass;

			NewClass.prototype = proto;

			// inherit parent's statics
			for (var i in this) {
				if (this.hasOwnProperty(i) && i !== 'prototype') {
					NewClass[i] = this[i];
				}
			}

			// mix static properties into the class
			if (props.statics) {
				Util.extend(NewClass, props.statics);
				delete props.statics;
			}

			// mix includes into the prototype
			if (props.includes) {
				Util.extend.apply(null, [proto].concat(props.includes));
				delete props.includes;
			}

			// merge options
			if (proto.options) {
				props.options = Util.extend(Class.Util.create(proto.options), props.options);
			}

			// mix given properties into the prototype
			Util.extend(proto, props);

			proto._initHooks = [];
			proto._destroyHooks = [];

			// add method for calling all hooks
			proto.callInitHooks = function () {

				if (this._initHooksCalled) { return; }

				if (parentProto.callInitHooks) {
					parentProto.callInitHooks.call(this);
				}

				this._initHooksCalled = true;

				for (var i = 0, len = proto._initHooks.length; i < len; i++) {
					proto._initHooks[i].call(this);
				}
			};
			proto.callDestroyHooks = function () {

				if (this._destroyHooksCalled) { return; }

				if (parentProto.callDestroyHooks) {
					parentProto.callDestroyHooks.call(this);
				}

				this._destroyHooksCalled = true;

				for (var i = 0, len = proto._destroyHooks.length; i < len; i++) {
					proto._destroyHooks[i].call(this);
				}
			};

			return NewClass;
		};


		// method for adding properties to prototype
		Class.include = function (props) {
			Util.extend(this.prototype, props);
		};

		// merge new default options to the Class
		Class.mergeOptions = function (options) {
			Util.extend(this.prototype.options, options);
		};

		// add a constructor hook
		Class.addInitHook = function (fn) { // (Function) || (String, args...)
			var args = Array.prototype.slice.call(arguments, 1);

			var init = typeof fn === 'function' ? fn : function () {
				this[fn].apply(this, args);
			};

			this.prototype._initHooks = this.prototype._initHooks || [];
			this.prototype._initHooks.push(init);
		};
		Class.addDestroyHook = function (fn) { // (Function) || (String, args...)
			var args = Array.prototype.slice.call(arguments, 1);

			var destroy = typeof fn === 'function' ? fn : function () {
				this[fn].apply(this, args);
			};

			this.prototype._destroyHooks = this.prototype._destroyHooks || [];
			this.prototype._destroyHooks.push(destroy);
		};

	// Class Util Methods

		Class.Util = {};

		Class.Util.setOptions = function ( obj, options ) {
			if (!obj.hasOwnProperty('options')) {
				obj.options = obj.options ? F.Util.create(obj.options) : {};
			}
			for (var i in options) {
				obj.options[i] = options[i];
			}
			return obj.options;
		};

		Class.Util.create = Object.create || (function () {
			function F() {}
			return function (proto) {
				F.prototype = proto;
				return new F();
			};
		})();

		Class.Util.construct = function ( constructor, args ) {
			var NewClass = function () {
				return constructor.apply(this, args);
			}
			NewClass.prototype = constructor.prototype;
			return new NewClass();
		};

	return Class;
})();
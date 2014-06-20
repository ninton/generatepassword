/**
 * jquery.generatepassword.js v0.1
 * http://www.flickpass.com
 *
 * Copyright 2014, Aoki Makoto, Ninton G.K. http://www.ninton.co.jp
 *
 * Released under the MIT license - http://en.wikipedia.org/wiki/MIT_License
 * 
 * Requirements
 *	jquery.js
 *	CryptoJS/components/core-min.js
 *	CryptoJS/rollups/sha256.js
 */

function PasswordGenerator () {
	// reference: Applied Cryptography, Second Edition, Bruce Schneier
	// 17.14 Real Random-seaquence Generators
	this.cnt           = 0;
	this.options       = {};
	this.pool          = 'random pool';
	this.pw            = '';
	this.client_random = '';
	this.rand_arr      = [];
	
	this.expandPwchars = function () {
		var chars = this.options.pwchars;
		
		chars = chars.replace( /0-9/g, '0123456789' );
		chars = chars.replace( /A-Z/g, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' );
		chars = chars.replace( /a-z/g, 'abcdefghijklmnopqrstuvwxyz' );		
		
		this.options.pwchars = chars;
	};
	
	this.churn = function ( i_randEvent ) {
		if ( typeof i_randEvent == 'undefined' || '' == i_randEvent ) {
			return ;
		}
		
		var old_pool = this.pool;

		this.pool = this.hash( this.pool, i_randEvent );
		
		if ( this.pool == old_pool ) {
			throw 'assert( this.pool == old_pool )';
		}
	};

	this.churnByServerRandom = function () {
		if ( typeof PASSWORD_GENERATOR_SERVER_RANDOM != 'undefined' ) {
			this.churn( PASSWORD_GENERATOR_SERVER_RANDOM );
		}
	};

	this.churnByClientRandom = function ( event ) {
		if ( this.client_random != '' ) {
			this.churn( this.client_random );
			this.client_random = '';
		}
	};
	
	this.churnByClientRandomAtFirst = function () {
		var arr = [];
		
		if ( typeof screen.width != 'undefined' ) {
			arr.push( screen.width );
			arr.push( screen.height );
			arr.push( screen.pixcelDepth );
			arr.push( screen.colorDepth );
		}
		if ( typeof screen.availWidth != 'undefined' ) {
			arr.push( screen.availWidth );
			arr.push( screen.availHeight );
		}
		if ( typeof document.documentElement.clientWidth != 'undefined' ) {
			arr.push( document.documentElement.clientWidth );
			arr.push( document.documentElement.clientHeight );
		}
		if ( typeof window.navigator.userAgent != 'undefined' ) {
			arr.push( window.navigator.userAgent );
		}
		if ( typeof window.navigator.appVersion != 'undefined' ) {
			arr.push( window.navigator.appVersion );
		}

		var buf = arr.join('');
		this.churn( buf );
	};
	
	this.collectClientRandom = function ( event ) {
		if ( 1000 < this.client_random.length ) {
			return;
		}
		
		var arr = [];

		// 1
		arr.push( String(Math.random()) );
		
		// 2
		var dt = new Date();
		arr.push( String(dt.getTime()) );
		arr.push( String(dt.getMilliseconds()) );

		// 3
		arr.push( String(event.clientX) );
		arr.push( String(event.clientY) );
			
		var buf = arr.join('');
		this.client_random += buf;
	};
	
	this.generatePassword = function () {
		var arr;
		var	r;
		
		while ( this.pw.length < this.options.pwlen ) {
			r = this.generateRandomByte();
			if ( r < this.options.pwchars.length ) {
				this.pw += this.options.pwchars[r];
			}
		}
	};

	this.generateRandomByte = function () {
		if ( 0 == this.rand_arr.length ) {
			this.generateRandomByteArray();
		}
		
		var r = this.rand_arr.shift();
		return r;
	};
	
	this.generateRandomByteArray = function () {
		++this.cnt;
		
		var s = this.hash( this.pool, String(this.cnt) );
		
		this.rand_arr = [];
		for ( var i = 0; i < s.length; ++i ) {
			this.rand_arr.push( s.charCodeAt(i) );
		}		
	};
	
	this.hash = function ( i_s1, i_s2 ) {
		var hasher = CryptoJS.algo.SHA256.create();
		hasher.update( i_s1 );
		hasher.update( i_s2 );
		var hex = hasher.finalize();
		
		var words = CryptoJS.enc.Hex.parse(String(hex));
		var buf = CryptoJS.enc.Latin1.stringify(words);
		var s = String(buf);
		return s;
	};
	
	this.init = function () {
		this.churnByServerRandom();
		this.churnByClientRandomAtFirst();
	};
	
	this.main = function ( i_options ) {
		this.options = i_options;
		this.pw = '';
		
		this.churnByClientRandom();
		this.expandPwchars();
		this.generatePassword();
		
		return this.pw;
	};	
}

(function($) {
	var PwGen = new PasswordGenerator();
	PwGen.init();

	$(window).mousemove( function(e) {
		PwGen.collectClientRandom( e );
	});
	
	$.fn.generatePassword = function( i_options ){
		var defaults = {
			'output'  : [],
			'pwchars' : '0-9A-Za-z',
			'pwlen'   : 8,
		};
		var options = $.extend( defaults, i_options );
		
		this.click( function() {
			var pw = PwGen.main( options );
			
			for ( var i = 0; i < options.output.length; ++i ) {
				$( options.output[i] ).val( pw );
			}
		});	
	};
})(jQuery);

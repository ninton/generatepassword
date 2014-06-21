jquery.generatepassword.js
http://www.flickpass.com

Copyright 2014, Aoki Makoto, Ninton G.K. http://www.ninton.co.jp

Released under the MIT license - http://en.wikipedia.org/wiki/MIT_License

Requirements
jquery.js
CryptoJS/components/core-min.js
CryptoJS/rollups/sha256.js

Features

5 random sources.

1. (optional) Server side random source. (PHP mcrypt_create_iv()).
2. javascript screen.width, window.navigator.userAgent, etc.
3. jquery event.clientX and event.clientY on mousemove.
4. javascript Math.random().
5. javascript Date.getTime() and Date.getMilliseconds().

Example

(see sample_1.html)
<input type="text" id="password" />
<input type="button" id="btn_genpw" />

<script type="text/javascript" src="//code.jquery.com/jquery-2.1.0.min.js"></script>
<script type="text/javascript" src="//crypto-js.googlecode.com/svn/tags/3.1.2/components/core-min.js"></script>
<script type="text/javascript" src="//crypto-js.googlecode.com/svn/tags/3.1.2/rollups/sha256.js"></script>
<script type="text/javascript" src="password_generator_server_random.php"></script>
<script type="text/javascript" src="jquery.generatepassword.js"></script>
<script type="text/javascript">
$('#btn_genpw').generatePassword({
output : ['#password'],
chars : '0-9A-Za-z',
length : 16
});
</script> 
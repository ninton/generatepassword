<?php
// password_generator_server_random.php

$data1 = $_SERVER['REQUEST_TIME_FLOAT'] . $_SERVER['REMOTE_ADDR'] . $_SERVER['REMOTE_PORT'];
$data2 = mcrypt_create_iv(32 * 8, MCRYPT_DEV_URANDOM);
$data = $data1 . $data2;
$hash = hash('sha256', $data, true);	// 32 bytes
$str = base64_encode($hash);			// 44 bytes

$json = json_encode( $str );

header( 'Content-type: text/javscript' );
echo sprintf( 'PASSWORD_GENERATOR_SERVER_RANDOM = %s;', $json );
?>

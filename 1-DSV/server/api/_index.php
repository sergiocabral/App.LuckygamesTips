<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

header("Access-Control-Allow-Origin: *");

define("DIRNAME_SERVER", "server");
define("DIRNAME_CLIENT", "client");

include "../3rd/JSMin/jsmin.php";

include "./Util/File.php";
include "./Core/Error.php";
include "./Load/Script.php";
include "./Load/Data.php";
include "./Core/Api.php";

new \Core\Api();
<?php

namespace Core {

    /**
     * Classe principal.
     */
    class Api {

        /**
         * Construtor.
         */
        public function __construct() {
            $parts = explode("/", $_SERVER["QUERY_STRING"]);

            $module = isset($parts[0]) ? $parts[0] : "";
            $command = isset($parts[1]) ? $parts[1] : "";
            $parameter = isset($parts[2]) ? $parts[2] : "";

            switch (strtolower($module)) {
                case "script":
                    $content = (new \Load\Script($command))->get();
                    break;
                case "data":
                    $content = (new \Load\Data($command))->get($parameter);
                    break;
            }

            if (isset($content) && $content) {
                echo $content;
            } elseif (isset($content)) {
                header("HTTP/1.0 404 Not Found");
            } else {
                header('Location: /');
            }
        }

    }
    
}
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
            if (isset($_GET["script"])) {
                new \Code\Script();
            } else {
                echo "not implemented";
            }
        }

    }
    
}
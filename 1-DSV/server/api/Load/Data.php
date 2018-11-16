<?php

namespace Load {

    class Data {

        /**
         * Construtor.
         *
         * @param string $type Tipo de dados.
         */
        public function __construct(string $type) {
            $this->type = $type;
        }

        /**
         * Tipo de arquivo.
         *
         * @var string
         */
        public $type;

        /**
         * Retorna o conteúdo do arquivo json.
         *
         * @param string $name Nome do dado a ser retornado.
         * @return string Código json.
         */
        public function get(string $name): string {
            $basedir = \Util\File::upDir(DIRNAME_SERVER, dirname(__FILE__));
            $file = strtolower($this->type . ($name ? "." . $name : "") . ".json");
            $path = "$basedir/../" . DIRNAME_CLIENT . "/src/Data/$file";
            
            if (!file_exists($path)) return "";

            $json = \file_get_contents($path);
            $minify = trim(\JSMin::minify($json));
            
            return $minify;
        }
    }   
}
<?php

namespace Load {

    class Script {

        /**
         * Construtor.
         *
         * @param string $context Contexto do script. 
         */
        public function __construct(string $context) {
            $this->context = $context;
        }

        /**
         * Contexto do script.
         *
         * @var string
         */
        public $content;

        /**
         * Retorna o conteúdo do script.
         *
         * @return string Código javascript.
         */
        public function get(): string {
            $filesAll = $this->getFilesInOrderToInclude();
            $filesFilter = array_keys(array_filter($filesAll, 
                function($item) { 
                    return 
                        strtolower($item) === strtolower($this->context) || 
                        (strtolower($item) === "initialize" && $this->context === ""); 
                }
            ));
            return $this->getBundle($filesFilter);
        }

        /**
         * Retorna lista completa dos arquivos JavaScript na ordem que devem ser incluídos.
         *
         * @return array
         */
        public function getFilesInOrderToInclude(): array {
            $result = [];

            $mainFile = "_index";

            $basedir = \Util\File::upDir(DIRNAME_SERVER, dirname(__FILE__));
            $content = file_get_contents("$basedir/../" . DIRNAME_CLIENT . "/src/{$mainFile}.ts");

            $matches = preg_grep('/^\/\/\/\s+(<reference\s*path="|script:)/', explode("\n", $content));
            $matches = array_map(function($item) {
                preg_match('/((?<==").*(?=")|(?<=script:).*)/i', $item, $matches);
                return !count($matches) ? "" : trim($matches[0]);
            }, $matches);

            if (in_array("", $matches) || 
                !count(array_filter($matches, function($item) { return strpos(strtolower($item), ".ts") !== false; })) ||
                !count(array_filter($matches, function($item) { return strpos(strtolower($item), ".ts") === false; })) ||
                count($matches) % 2 !== 0) \Core\Error::die(__FILE__, __LINE__, "Invalid content in the TypeScript file.");

            $matches = array_values($matches);

            $result = [];
            for ($i = 0; $i < count($matches); $i += 2) { 
                $file = preg_replace('/\.[^\.]*/', '', $matches[$i]);
                $modules = $matches[$i + 1];
                $result[$file] = $modules;
            }
            $result[$mainFile] = "";

            return $result;            
        }

        /**
         * Retorna bundle com o código JavaScript dos arquivos informados.
         *
         * @param array $files Arquivos que serão incluídos no código.
         * @return string Código JavaScript.
         */
        public function getBundle(array $files): string {
            $basedir = \Util\File::upDir(DIRNAME_SERVER, dirname(__FILE__));

            $result = "";
            foreach ($files as $file) {       
                $filePath = "$basedir/" . DIRNAME_CLIENT . "/{$file}.js";
                if (!file_exists($filePath)) $filePath .= "x";
                $result .= \file_get_contents($filePath);
            }
            return $result;
        }
    }
}
<?php

namespace Code {

    class Script {

        /**
         * Construtor.
         */
        public function __construct() {
            $module = preg_replace('/[^a-z]/i', '', $_GET["script"]);
            $filesAll = $this->getFilesInOrderToInclude();
            $filesFilter = array_keys(array_filter($filesAll, function($item) use ($module) { return $item === $module; }));
            echo $this->getBundle($filesFilter);
        }

        /**
         * Retorna lista completa dos arquivos JavaScript na ordem que devem ser incluídos.
         *
         * @return array
         */
        public function getFilesInOrderToInclude(): array {
            $result = [];
            $mainFile = "_index";
            $content = \file_get_contents("../../script/src/{$mainFile}.ts");
            $matches = preg_grep('/^\/\/\/.*?<reference\s+?path=".*$/', explode("\n", $content));

            foreach ($matches as $match) {
                preg_match('/(?<=path=").*?(?=")/', $match, $path);
                
                $module = preg_replace('/\.tsx*$/', '', $path[0]);
                
                $context = preg_grep("/(?<=\/\/\/)\s*script.*?(?=$module)/", explode("\n", $content));
                preg_match('/(?<=script=).*?(?=:)/', array_values($context)[0], $context);
                $context = $context[0];

                $result[$module] = $context;
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
            $result = "";
            foreach ($files as $file) {       
                $filePath = "../script/{$file}.js";
                if (!file_exists($filePath)) $filePath .= "x";
                $result .= \file_get_contents($filePath);
            }
            return $result;
        }

    }

}
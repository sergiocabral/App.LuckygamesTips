<?php

namespace Util {

    /**
     * Utilitários relacionados a diretórios e arquivos.
     */
    class File {

        /**
         * Retorna o caminho para o diretório solicitado.
         * Caso não seja encontrado retorna false.
         *
         * @param string $dirname Nome do diretório
         * @param string $path Caminho interno ao diretório
         * @return string Caminho do diretório.
         */
        public static function upDir(string $dirname, string $path): string {
            $i = 0;
            $last = "";
            while (strtolower(basename($path)) !== strtolower($dirname)) {
                $i++; if ($i > 100) die('lolololol');
                if ($last === $path) return false;
                $path = dirname($last = $path);
            }
            return $path;
        }

    }
    
}
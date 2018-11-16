<?php

namespace Core {

    /**
     * Manipulador de erros.
     */
    class Error {

        /**
         * Interrompe a execução do script e exibe a mensagem de erro.
         *
         * @param string $file Deve receber a variável mágica __FILE__
         * @param string $line Deve receber a variável mágica __LINE__
         * @param string $message Opcional. Mensagem de retorno descrevendo o motivo da interrupção.
         * @return void
         */
        public static function die(string $file, string $line, string $message = "") {
            $basedir = \Util\File::upDir("api", $file);
            $module = preg_replace('/\.php$/i', '', str_replace($basedir, "", $file));

            $details = "";
            $details .= "[" . date('Y-m-d H:i:s') . "] ";
            $details .= "$module\\$line";
            $details .= !$message ? "" : ": $message";

            die($details);
        }

    }
    
}
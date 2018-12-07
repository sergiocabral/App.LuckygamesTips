<?php
/**
 * Classe com métodos estáticos com funcionalidades relacionadas a endereços URL
 */
class UtilUrl {
    /**
     * Extrai o endereço url sem querystring.
     */
    public static function ExtrairComando() {
        return $_SERVER["QUERY_STRING"];
    }

    /**
     * Extrai os argumentos passados como querystring no endereço url
     */
    public static function ExtrairQueryString() {
        $url = $_SERVER["REQUEST_URI"];
        $querystring = substr($url, strpos($url . "?", "?") + 1);
        return $querystring ? $querystring : "";
    }
}
?>
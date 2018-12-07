<?php
//Registra um tratamento customizado para exceptions.
set_error_handler('UtilException::ErrorHandler');

/**
 * Classe com métodos estáticos com funcionalidades relacionadas ao
 * tratamento de Exceptions
 */
class UtilException {
    /**
     * Tratamento customizado de exceptions
     * @param integer $errno Nível de erro.
     * @param string $errstr Mensagem do erro.
     * @param string $errfile Nome do arquivo no qual o erro ocorreu
     * @param integer $errline Número da linha no arquivo.
     * @param array $errcontext Matriz que aponta para a tabela de símbolos ativos no ponto aonde o erro ocorreu.
     * @return bool Quando false, passa o tratamento de erro para o sistema.
     */
    public static function ErrorHandler($errno, $errstr, $errfile, $errline, $errcontext) {
        $errosIgnorados = [E_NOTICE];
        if (in_array($errno, $errosIgnorados)) {
            return true;
        }

        if (Util::DebugAtivo()) {
            //Em caso de Debug usa o tratamento de erros padrão.
            return false;
        }

        switch ($errno) {
        case E_USER_ERROR:
            echo "<span style='color: white; background-color: red;'><b>ERRO:</b> $errstr</span><br />\n";
            exit(1);
            break;
        default:
            break;
        }
    }

    /**
     * Classificação dos erros encontrados em errno.
     * @return string[] Array nomeado com código de erro e seu respectivo nome de constante.
     */
    public static function TabelaDeErros() {
        return array(
            E_ERROR => "E_ERROR",
            E_WARNING => "E_WARNING",
            E_PARSE => "E_PARSE",
            E_NOTICE => "E_NOTICE",
            E_CORE_ERROR => "E_CORE_ERROR",
            E_CORE_WARNING => "E_CORE_WARNING",
            E_COMPILE_ERROR => "E_COMPILE_ERROR",
            E_COMPILE_WARNING => "E_COMPILE_WARNING",
            E_USER_ERROR => "E_USER_ERROR",
            E_USER_WARNING => "E_USER_WARNING",
            E_USER_NOTICE => "E_USER_NOTICE",
            E_STRICT => "E_STRICT",
            E_RECOVERABLE_ERROR => "E_RECOVERABLE_ERROR",
            E_DEPRECATED => "E_DEPRECATED",
            E_USER_DEPRECATED => "E_USER_DEPRECATED",
            E_ALL => "E_ALL",
        );
    }

    /**
     * Dispara uma exceção de erro para o sistema ou usuário.
     * @param string $errstr Mensagem do erro.
     * @param string $arquivo Deve sempre receber: __FILE__
     * @param integer $linha Deve sempre receber: __LINE__
     * @param integer $errno Nível de erro.
     */
    public static function Disparar($errstr, $arquivo, $linha, $errno = 0) {
        $errnoStr = "";
        if ($errno) {
            $tabelaDeErros = self::TabelaDeErros();
            $erro;
            if (array_key_exists($errno, $tabelaDeErros)) {
                $erro = $tabelaDeErros[$errno];
            } else {
                $erro = $errno;
            }
            $errnoStr = " (Erro: <b>$erro</b>)";
        }

        $arquivoInfo = "";
        if ($arquivo) {
            $arquivo = strpos($arquivo, "/") ? explode("/", $arquivo) : explode("\\", $arquivo);
            $arquivo = $arquivo[count($arquivo) - 1];

            $arquivoInfo = " (<b>$arquivo</b>";
            if ($linha) {
                $arquivoInfo .= " linha <b>$linha</b>";
            }
            $arquivoInfo .= ")";
        }

        trigger_error($errstr . $errnoStr . $arquivoInfo, E_USER_ERROR);
    }
}
?>
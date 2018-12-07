<?php
/**
 * Classe com métodos estáticos com funcionalidades para tipos string
 */
class UtilString {
    /**
     * Extrai os argumentos passados como endereço url
     * @param  string $url Endereço url.
     * @return array       Lista dos argumentos em ordem.
     */
    public static function ArgumentosToArray($url) {
        if (strpos($url, '?')) {
            //Remove querystring se houver.
            $url = strstr($url, "?", true);
        }
        //Montar o array ignorando vazios.
        return preg_split('/\//', $url, -1, PREG_SPLIT_NO_EMPTY);
    }

    /**
     * Extrai os argumentos passados como querystring no endereço url
     * @param  string $url Endereço url.
     * @return array       Lista dos argumentos em ordem.
     */
    public static function QueryStringToArray($url) {
        //Prossegue apenas se existir a marca de querystring.
        if (strpos($url, "?")) {
            $url = substr($url, strpos($url, "?"));
        }

        $result = [];
        $querystring = $url;
        $pares = preg_split('/&/', $querystring, -1, PREG_SPLIT_NO_EMPTY);
        foreach ($pares as $par) {
            $key = urldecode(strstr($par . "=", "=", true));
            $value = urldecode(substr(strstr($par, "="), 1));
            $result[$key] = $value;
        }
        return $result;
    }

    /**
     * Obtem o hash de uma string
     * @param string $str Valor.
     */
    public static function Hash($str) {
        return base64_encode(password_hash($str, PASSWORD_DEFAULT, ['cost' => 12]));
    }

    /**
     * Confere uma string com o hash obtido anteriormente
     * @param string $str Valor.
     * @param string $hash Hash.
     */
    public static function HashConfere($str, $hash) {
        return password_verify($str, base64_decode($hash));
    }

    /**
     * Trata a exibição ao usuário de um campo de senha
     * @param string $senha Senha
     * @return string Retorna o valor da senha de forma oculta.
     */
    public static function ExibirSenha($senha) {
        if (Util::DebugAtivo()) {
            return $senha;
        } else {
            return $senha === null ? null : "***";
        }
    }

    /**
     * Valida um número de CPF
     * http://www.geradorcpf.com/script-validar-cpf-php.htm
     * @param mixed $cpf Número do CPF
     * @return bool Retorna true para validação correta.
     */
    public static function ValidaCPF($cpf) {
        // Verifica se um número foi informado
        if(!$cpf) {
            return false;
        }

        // Elimina possivel mascara
        $cpf = preg_replace('[^0-9]', '', $cpf);
        $cpf = str_pad($cpf, 11, '0', STR_PAD_LEFT);

        // Verifica se o numero de digitos informados é igual a 11
        if (strlen($cpf) != 11) {
            return false;
        }
        // Verifica se nenhuma das sequências invalidas abaixo
        // foi digitada. Caso afirmativo, retorna falso
        else if ($cpf == '00000000000' ||
            $cpf == '11111111111' ||
            $cpf == '22222222222' ||
            $cpf == '33333333333' ||
            $cpf == '44444444444' ||
            $cpf == '55555555555' ||
            $cpf == '66666666666' ||
            $cpf == '77777777777' ||
            $cpf == '88888888888' ||
            $cpf == '99999999999') {
            return false;
            // Calcula os digitos verificadores para verificar se o
            // CPF é válido
        } else {

            for ($t = 9; $t < 11; $t++) {

                for ($d = 0, $c = 0; $c < $t; $c++) {
                    $d += $cpf{$c} * (($t + 1) - $c);
                }
                $d = ((10 * $d) % 11) % 10;
                if ($cpf{$c} != $d) {
                    return false;
                }
            }

            return true;
        }
    }

}
?>
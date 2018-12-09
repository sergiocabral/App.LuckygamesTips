<?php
namespace Mysys\Framework\Core;

/**
 * Coleção de funcionalidads de uso geral.
 */
abstract class Util {

    /**
     * Dispara um erro através de die();
     * @param mixed $msg Mensagem
     * @param mixed $where Local do erro: __FILE__ ou self::class
     * @param mixed $excpetion Exceção se existir.
     */
    public static function error($msg, $where, $excpetion = null) {
        die("[$where] $msg" . ($excpetion instanceof \Exception ? ' (' . $excpetion->getMessage() . ')' : ''));
    }

    /**
     * Define com verificação de existência.
     * @param string $name
     * @param mixed $value
     */
    public static function define($name, $value) {
        if (!defined($name)) {
            define($name, $value);
        }
    }

    /**
     * Remove um arquivo ou diretório.
     * @param string $fileOrDir Caminho.
     * @return boolean Retorna true para sucesso, ou false para falha.
     */
    public static function deleteFileOrDir($fileOrDir) {
        if (is_dir($fileOrDir)) {
            return self::deleteDirectory($fileOrDir);
        } else {
            return self::deleteFile($fileOrDir);
        }
    }

    /**
     * Remove um diretório com opção de recursividade.
     * @param string $dir Diretório.
     * @param boolean $recursive Remove toda a estrutura de diretórios internos.
     * @return boolean Retorna true para sucesso, ou false para falha.
     */
    public static function deleteDirectory($dir, $recursive = TRUE) {
        if (is_dir($dir)) {
            if ($recursive) {
                foreach (scandir($dir) as $object) {
                    if ($object !== '.' && $object !== '..') {
                        $path = $dir . '/' . $object;

                        if (is_dir($path)) {
                            self::deleteDirectory($path);
                        } else {
                            unlink($path);
                        }
                    }
                }
            }
            return rmdir($dir);
        }
        return false;
    }

    /**
     * Remove um arquivo caso exista.
     *
     * @param string $file Caminho do arquivo.
     * @return boolean Retorna true em sucesso, false em falha, na remoção.
     */
    public static function deleteFile($file) {
        if (file_exists($file)) {
            return unlink($file);
        }
        return false;
    }

    /**
     * Retorna o caminho para o diretório solicitado.
     * Caso não seja encontrado retorna false.
     *
     * @param string $dirname Nome do diretório
     * @param string $path Caminho interno ao diretório
     * @return string Caminho do diretório.
     */
    public static function upDirectory(string $dirname, string $path): string {
        $last = "";
        while (strtolower(basename($path)) !== strtolower($dirname)) {
            if ($last === $path) return false;
            $path = dirname($last = $path);
        }
        return $path;
    }

    /**
     * Retorna o caminho para o diretório anterior que contenha o arquivo informado.
     * Caso não seja encontrado retorna false.
     *
     * @param string $filename Nome do arquivo ou diretório
     * @param string $path Caminho interno ao diretório
     * @return string Caminho do diretório.
     */
    public static function upDirectoryWithFile(string $filename, string $path): string {
        $last = "";
        while (!file_exists("$path\\$filename")) {
            if ($last === $path) return false;
            $path = dirname($last = $path);
        }
        return $path;
    }
    
    /**
     * Envia para um arquivo o conteúdo de uma variável.
     * @param mixed $var Variáve a ser registrada em arquivo.
     * @param string $mode Opcional. Modo para obtenção dos dados: var_dump ou print_r
     * @param string $file Opcional. Caminho do arquivo.
     * @return void
     */
    public static function log($var, $mode = 'var_dump', $file = null) {
        if (empty($file)) {
            $file = implode(DIRECTORY_SEPARATOR, [
                dirname(__FILE__),
                '..',
                '..',
                'debug.log.html'
            ]);
        }

        switch ($mode) {
            case 'var_dump':
                ob_start();
                var_dump($var);
                $dump = ob_get_clean();
                break;
            case 'print_r':
            default:
                $dump = print_r($var, true);
                break;
        }

        if (false === @file_put_contents($file, $dump . (PHP_EOL . PHP_EOL . str_repeat(str_repeat('#', 40) . PHP_EOL, 3) . PHP_EOL), FILE_APPEND | LOCK_EX)) {
            self::error('Without permission to write file.', self::class);
        }
    }

    /**
     * Reduz código com minify.
     * @param string $str Código.
     * @return string código minificado.
     */
    public static function minifyCss($code) {
        # remove comments first (simplifies the other regex)
        $re1 = <<<'EOS'
(?sx)
# quotes
(
"(?:[^"\\]++|\\.)*+"
| '(?:[^'\\]++|\\.)*+'
)
|
# comments
/\* (?> .*? \*/ )
EOS;

        $re2 = <<<'EOS'
(?six)
# quotes
(
"(?:[^"\\]++|\\.)*+"
| '(?:[^'\\]++|\\.)*+'
)
|
# ; before } (and the spaces after it while we're here)
\s*+ ; \s*+ ( } ) \s*+
|
# all spaces around meta chars/operators
\s*+ ( [*$~^|]?+= | [{};,>~+-] | !important\b ) \s*+
|
# spaces right of ( [ :
( [[(:] ) \s++
|
# spaces left of ) ]
\s++ ( [])] )
|
# spaces left (and right) of :
\s++ ( : ) \s*+
# but not in selectors: not followed by a {
(?!
(?>
  [^{}"']++
| "(?:[^"\\]++|\\.)*+"
| '(?:[^'\\]++|\\.)*+'
)*+
{
)
|
# spaces at beginning/end of string
^ \s++ | \s++ \z
|
# double spaces to single
(\s)\s+
EOS;

        $code = preg_replace("%$re1%", '$1', $code);
        return preg_replace("%$re2%", '$1$2$3$4$5$6$7', $code);
    }

    /**
     * Converte um valor num Id.
     * @param integer $length Opcional. Comprimento da string.
     * @param string $value Opcional. Valor inicial.
     * @param string $funcToApply Opcional. Função aplicada ao resultado.
     * @param string $blackList Opcional. Lista de caracteres proibidos. O padrão evita caracteres que geram confusão de leitura.
     * @return string
     */
    public static function unique($length = 5, $value = null, $funcToApply = 'strtoupper(?)', $blackList = '=0125IOUSZ') {
        $ignore = array_unique(str_split('=' . strtolower($blackList) . strtolower($blackList)));
        $shuffle = function($text) use ($ignore) {
            return str_replace($ignore, '', substr(base64_encode(hash('CRC32', $text)), 5));
        };

        $id = $shuffle($value !== null ? $value : rand(100000, 999999) . date('ymdhis'));
        while (strlen($id) < $length) {
            $id .= $shuffle($id);
        }

        eval('$id = ' . str_replace('?', '$id', !empty($funcToApply) ? $funcToApply : '?') . ';');
        return substr($id, 0, $length);
    }


    /**
     * Converte um texto num formato para uso como slug.
     * @param string $text Texto qualquer
     * @return string Texto em modo slug
     */
    public static function slugify($text)
    {
        // replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);

        // trim
        $text = trim($text, '-');

        // remove duplicate -
        $text = preg_replace('~-+~', '-', $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
            return 'n-a';
        } else {
            return $text;
        }
    }

    /**
     * Semelhante a str_replace, mas no conteúdo de um arquivo.
     * @param string $file
     * @param string $search
     * @param string $replace
     * @return boolean Retorna true caso ocorra escrita no arquivo.
     */
    public static function replaceInFile($file, $search, $replace) {
        $code = file_get_contents($file);
        if (strpos($code, $search) !== false) {
            $code = str_replace($search, $replace, $code);
            if (false === @file_put_contents($file, $code)) {
                self::error('Without permission to write file.', self::class);
            }
            return true;
        }
        return false;
    }

    /**
     * Retorna o valor da url atual.
     * @return string
     */
    public static function url() {
        return (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
    }

    /**
     * Extrai as partes da url atual.
     * @param array $dividers Delimitadores possíveis.
     * @return array Partes da url.
     */
    public static function urlParams($dividers = [ '/', '?', '&' ]) {
        $url = $_SERVER['REQUEST_URI'];

        $dividers = is_array($dividers) ? $dividers : [ $dividers ];

        if (count($dividers) === 0) {
            return $url;
        }

        $url = str_replace($dividers, $dividers[0], $url);
        $parts = array_values(array_filter(explode($dividers[0], $url), function($value) { return $value !== ''; }));
        $params = [];

        foreach ($parts as $value)
        {
            if (strpos($value, '=') > 0) {
                $key = substr($value, 0, strpos($value, '='));
                $value = substr($value, strpos($value, '=') + 1);

                $params[$key] = $value;
            } else {
                $params[] = $value;
            }
        }

        return $params;
    }

    /**
     * Valida o formato de um email.
     * @param string $email
     * @return boolean
     */
    public static function isValidEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * Valida o formato de um telefone.
     * @param string $phone
     * @return boolean
     */
    public static function isValidPhone($phone) {
        $numbersOnly = preg_replace("/[-\(\)\s]/", '', $phone);
        if (strlen($numbersOnly) < 10 || strlen(preg_replace("/[0-9]/", "", $numbersOnly)) !== 0) {
            return false;
        }
        return true;
    }

    /**
     * Verifica se a senha é fraca demis.
     * @param string $password
     * @return boolean
     */
    public static function isWeakPassword($password) {
        return
            (6 > strlen($password = trim($password))) ||
            ('' === preg_replace("/[0-9]/", "", $password)) ||
            ('' === preg_replace("/[a-z]/i", "", $password));
    }

    /**
     * Criptografa um texto.
     * @param string $text
     * @param string $password
     * @return string
     */
    public static function encrypt($text, $password = AUTH_KEY) {
        return openssl_encrypt($text, "AES-128-ECB", $password);
    }

    /**
     * Descriptografa um texto.
     * @param string $text
     * @param string $password
     * @return string
     */
    public static function decrypt($text, $password = AUTH_KEY) {
        return openssl_decrypt($text, "AES-128-ECB", $password);
    }

    /**
     * Converte um texto em código html sem acentuação ou quebra de linha.
     * @param string $text
     * @return string
     */
    public static function textToHtml($text) {
        return str_replace(array("\r"), '', str_replace("\n", "<br />", htmlentities($text)));
    }

    /**
     * Aplica um encode nas propriedades tipo string de um array ou objeto.
     * @param array|\stdClass $array Array ou stdClass.
     * @param string $encode Opcional. Padrão UTF-8.
     * @return array
     */
    public static function encodeArray($array, $encode = 'UTF-8') {
        if ($array instanceof \stdClass) {
            $array = (array)$array;
        }

        foreach ($array as &$value) {
            if (is_string($value)) {
                $value = mb_convert_encoding($value, 'UTF-8', mb_detect_encoding($value, 'UTF-8, ISO-8859-1', true));
            } elseif (is_array($value) || $value instanceof \stdClass) {
                $value = self::encodeArray($value, $encode);
            }
        }
        return $array;
    }

    /**
     * Converte um array ou stdClass em JSON com o ajuste de encoding.
     * @param array|\stdClass $array Array ou stdClass.
     * @param string $encode Opcional. Padrão UTF-8.
     * @return string
     */
    public static function json($array, $encode = 'UTF-8') {
        $encodeArray = self::encodeArray($array);
        $json = json_encode($encodeArray, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $json;
    }
}
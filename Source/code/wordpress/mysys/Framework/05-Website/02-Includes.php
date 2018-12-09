<?php
namespace Mysys\Website;

/**
 * Manipula arquivos para includes.
 */
class Includes extends \Mysys\Core\Singleton {

    /**
     * @return Includes
     */
    public static function instance () { return parent::instance(); }

    /**
     * Retorna o caminho do arquivo minificado.
     * Minifica caso não exista.
     * @param string $file Caminho do arquivo.
     * @return string Caminho do arquivo minificado.
     */
    public function minify($file) {
        if (!\Mysys\Data\Environment::instance()->isDebug()) {
            $extensions = array(
                '.css',
                '.js',
                '.css.php',
                '.js.php'
            );

            foreach ($extensions as $ext) {
                if (strtolower(substr($file, -strlen($ext))) === $ext) {
                    $fileMinify = substr($file, 0, strlen($file) - strlen($ext)) . '.min' . $ext;
                    if (file_exists($fileMinify)) {
                        return $fileMinify;
                    } elseif (file_exists($file)) {
                        $content = file_get_contents($file);
                        switch (strtolower($ext)) {
                            case '.css.php':
                            case '.css':
                                $content = $this->minifyCss($content);
                                break;
                            case '.js.php':
                            case '.js':
                                $content = $this->minifyJs($content);
                                break;
                            default:
                                return $file;
                        }

                        if (false === @file_put_contents($fileMinify, $content)) {
                            self::error('Without permission to write file.', self::class);
                        }

                        // Opção de excluir o arquivo original após minificado.
                        // unlink(ABSPATH . $file);

                        return $fileMinify;
                    }
                }
            }
        }
        return $file;
    }

    /**
     * Escreve o código para include de um arquivo apenas se a url atual contiver a url informada.
     * @param string $file Nome do arquivo.
     * @param array $urls String ou array com os REQUEST_URI que validam o include.
     * @return boolean Retorna true quando pelo menos uma escrita é feita.
     */
    public function writeIf($file, $pages) {
        $pages = is_array($pages) ? $pages : array($pages);
        $url = strtolower($this->url());
        foreach ($pages as $page) {
            if (strpos($url, home_url($page)) === 0) {
                $this->write($file);
                return true;
            }
        }
        return false;
    }

    /**
     * Lista para verificação de de adição única.
     * @var array
     */
    private static $_writeUnique = [];

    /**
     * Escreve o código para include de um arquivo.
     * @param string $file Nome do arquivo.
     * @param boolean $unique Nome do arquivo.
     * @return boolean Retorna true quando pelo menos uma escrita é feita.
     */
    public function write($file, $unique = true) {
        self::$_writeUnique[$file] = isset(self::$_writeUnique[$file]) ? self::$_writeUnique[$file] : 0;

        if ($unique && self::$_writeUnique[$file] > 0) {
            return false;
        }

        $hasWrite = false;
        $extensions = array(
            '.css',
            '.css.php',
            '.js',
            '.js.php',
            '.html',
            '.php',
        );

        $filePath = strpos(str_replace('\\', '/', $file), '/') !== false ? $file : $this->getWebsiteDir('Includes') . $file;

        foreach ($extensions as $ext) {
            $path = $filePath . $ext;
            if ($ext !== '.html' && $ext !== '.php') {
                $path = $this->minify($path);
            }

            if (!file_exists($path)) {
                continue;
            }

            $hasWrite = true;
            
            switch ($ext) {
                case '.css':
                    echo "<link rel='stylesheet' type='text/css' href='" . $this->dirToUrl($path) . "' />";
                    break;
                case '.js':
                    echo "<script src='" . $this->dirToUrl($path) . "'></script>";
                    break;
                case '.css.php':
                case '.js.php':
                case '.html':
                case '.php':
                    include $path;
                    break;
            }
        }

        if ($hasWrite) {
            self::$_writeUnique[$file]++;
        }
        
        return $hasWrite;
    }

    /**
     * Retorna o conteúdo de um template.
     * @param mixed $name
     */
    public function getPostTemplate($name) {
        $file = $this->getWebsiteDir('Includes') . "template.post.$name.html";
        if (file_exists($file)) {
            $html = file_get_contents($file);
            $html = mb_convert_encoding($html, 'UTF-8', mb_detect_encoding($html, 'UTF-8, ISO-8859-1', true));
            return $html;
        } else {
            return false;
        }
    }
}
<?php
namespace Mysys\Framework\Core;

/**
 * Coleção de funcionalidads de uso geral específicos para o Framework.
 */
abstract class Base extends Util {

    /**
     * Reduz código com minify.
     * @param string $str Código.
     * @return string código minificado.
     */
    public static function minifyJs($code) {
        return \JSMin::minify($code);
    }

    /**
     * Retorna o diretório do framework.
     * @param string $subdir Quando informado inclui o subdir e coloca o separador no final.
     * @return string
     */
    public static function getFrameworkDir($subdir = null) {
        $path = dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR;
        if (!empty($subdir)) {
            $path .= $subdir . DIRECTORY_SEPARATOR;
        }
        return $path;
    }

    /**
     * Retorna o diretório do Website.
     * @param string $subdir Quando informado inclui o subdir e coloca o separador no final.
     * @return string
     */
    public static function getWebsiteDir($subdir = null) {
        $frameworkDir = self::getFrameworkDir();
        $frameworkDirname = basename($frameworkDir);

        $dir = dirname($frameworkDir);
        $websiteDirname = array_values(array_filter(array_map('basename', glob($dir . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR)), function($dir) use ($frameworkDirname) { return $dir !== $frameworkDirname; }))[0];
        $path = $dir . DIRECTORY_SEPARATOR . $websiteDirname . DIRECTORY_SEPARATOR;

        if (!empty($subdir)) {
            $path .= $subdir . DIRECTORY_SEPARATOR;
        }

        return $path;
    }

    /**
     * Retorna a url para um diretório.
     * @param string $url Quando informado inclui no final.
     * @return string
     */
    private static function getUrl($dir, $url = null) {
        $baseDir = dirname($dir);

        $dirname = basename($dir);
        $baseDirname = basename($baseDir);

        $url = home_url("$baseDirname/$dirname/$url");

        return $url;
    }

    /**
     * Retorna a url para o diretório do framework.
     * @param string $url Quando informado inclui no final.
     * @return string
     */
    public static function getFrameworkUrl($url = null) {
        return self::getUrl(self::getFrameworkDir(), $url);
    }

    /**
     * Retorna a url para o diretório do Website.
     * @param string $url Quando informado inclui no final.
     * @return string
     */
    public static function getWebsiteUrl($url = null) {
        return self::getUrl(self::getWebsiteDir(), $url);
    }

    /**
     * Converte um diretório em uma url.
     * @param string $dir
     * @return string
     */
    public static function dirToUrl($dir) {
        $baseDir = dirname(dirname(dirname(dirname(__FILE__)))) . DIRECTORY_SEPARATOR;

        if (strpos(strtolower($dir), strtolower($baseDir)) === 0) {
            $dir = str_replace('\\', '/', home_url(substr($dir, strlen($baseDir))));
            return $dir;
        }
        return false;
    }

}
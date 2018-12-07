<?php
namespace Mysys\Core;

/**
 * Coleção de funcionalidads de uso geral específicos para o Framework.
 */
abstract class Base extends Util {

    /**
     * Reduz código com minify.
     * @param string $str Código.
     * @return string código minificado.
     */
    public static function MinifyJs($code) {
        return \JSMin::minify($code);
    }

    /**
     * Retorna o diretório do framework.
     * @param string $subdir Quando informado inclui o subdir e coloca o separador no final.
     * @return string
     */
    public static function GetFrameworkDir($subdir = null) {
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
    public static function GetWebsiteDir($subdir = null) {
        $frameworkDir = self::GetFrameworkDir();
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
    private static function GetUrl($dir, $url = null) {
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
    public static function GetFrameworkUrl($url = null) {
        return self::GetUrl(self::GetFrameworkDir(), $url);
    }

    /**
     * Retorna a url para o diretório do Website.
     * @param string $url Quando informado inclui no final.
     * @return string
     */
    public static function GetWebsiteUrl($url = null) {
        return self::GetUrl(self::GetWebsiteDir(), $url);
    }

    /**
     * Converte um diretório em uma url.
     * @param string $dir
     * @return string
     */
    public static function DirToUrl($dir) {
        $baseDir = dirname(dirname(dirname(dirname(__FILE__)))) . DIRECTORY_SEPARATOR;

        if (strpos(strtolower($dir), strtolower($baseDir)) === 0) {
            $dir = str_replace('\\', '/', home_url(substr($dir, strlen($baseDir))));
            return $dir;
        }
        return false;
    }

}
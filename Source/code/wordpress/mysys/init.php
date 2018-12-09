<?php

/**
 * Faz o inlude de todos os arquivos do framework.
 * @param mixed $dir Diretório dentro da área d framework: Framework e Business
 * @param mixed $count Total de arquivos incluídos.
 * @return integer Total de arquivos incluídos;
 */
function includeAll($dir, $count = 0) {

    $dir = !empty($dir) ? $dir : 'Framework';
    $dir = strpos(str_replace('\\', '/', $dir), '/') !== false ? $dir : dirname(__FILE__) . DIRECTORY_SEPARATOR . $dir;

    $items = scandir($dir);

    array_walk($items, function(&$item) use ($dir) { $item = $dir . DIRECTORY_SEPARATOR . $item; });

    $dirs = array_filter($items, function($item) { return substr($item, -1) !== '.' && is_dir($item); });
    $files = array_filter($items, function($item) { return !is_dir($item); });

    foreach ($dirs as $dir)
    {

        $count += includeAll($dir, $count);

    }

    foreach ($files as $file) {

        if (strtolower(basename(dirname($file))) !== 'includes' && strtolower(pathinfo($file, PATHINFO_EXTENSION)) === 'php') {

            $ext = strtolower(substr($file, strrpos($file, '.', -strlen($file) + strrpos($file, '.') - 1)));

            if ($ext !== '.css.php' && $ext !== '.js.php') {

                require_once $file;

                $count++;

            }

        }

    }

    return $count;

};

includeAll('Framework') && includeAll('Business') && \Mysys\Framework\Main::instance();
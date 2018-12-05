<?php
namespace Mysys\Wordpress;

/**
 * Gerencia o redirecionamento de urls do website. Ajusta rotas.
 */
class Util {

    /**
     * Ativa um tema.
     * @param string $theme Nome do tema
     * @return boolean Sucesso retorna true. Falha retorna false.
     */
    public static function ActivateTheme($theme) {
        update_option('template', 'SOHO');
        update_option('stylesheet', 'SOHO');
        return true;
    }

    /**
     * Ativa um plugin.
     * @param string $plugin Nome do plugin
     * @return boolean Sucesso retorna true. Falha retorna false.
     */
    public static function ActivatePlugin($plugin) {
        $current = get_option('active_plugins');
        $plugin = plugin_basename(trim($plugin));
        if (!in_array($plugin, $current)) {
            $current[] = $plugin;
            sort($current);
            do_action('activate_plugin', trim($plugin));
            update_option('active_plugins', $current);
            do_action('activate_' . trim($plugin));
            do_action('activated_plugin', trim($plugin));
            return true;
        }
        return false;
    }
}
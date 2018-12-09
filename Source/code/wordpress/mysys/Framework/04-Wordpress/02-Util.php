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
    public static function activateTheme($theme) {
        switch_theme($theme);
        return true;
    }

    /**
     * Ativa um plugin.
     * @param string $plugin Nome do plugin
     * @param boolean $mode Opcional. Ativa ou desativa. Padrão ativar.
     * @return boolean Sucesso retorna true. Falha retorna false.
     */
    public static function activatePlugin($plugin, $mode = true) {
        $current = get_option('active_plugins');
        $plugin = plugin_basename(trim($plugin));
        if ($mode && !in_array($plugin, $current)) {
            return activate_plugins($plugin) || true;
        } else if ($mode && !in_array($plugin, $current)) {
            return deactivate_plugins($plugin) || true;
        }
        return false;
    }
}
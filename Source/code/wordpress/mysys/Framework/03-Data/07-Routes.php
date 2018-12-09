<?php
namespace Mysys\Data;

/**
 * Aplicação do plugin Mysys no Wordpress.
 */
class Routes extends LoadData {

    /**
     * @return Routes
     */
    public static function instance () { return parent::instance(); }

    /**
     * Realiza as atividads desta classe na inicialização do Mysys.
     */
    public function init() {
        \Mysys\Core\Event::instance()->bind('onWordpressLoaded', function() {
            $this->setDefaultsIfNecessary();
        });
    }

    /**
     * Define os nomes padrão das rotas.
     * @param mixed $force Quando true sempre redefine os valores atuais.
     */
    public function setDefaultsIfNecessary($force = false) {
        foreach ($this->data as $route => $default) {
            $option = "mysys_route_$route";
            $value = $force ? null : get_option($option);
            if ($force || empty($value)) {
                $value = $default;
                update_option($option, $value);
            }
        }
    }
}
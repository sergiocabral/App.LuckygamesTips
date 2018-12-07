<?php
namespace Mysys\Data;

/**
 * Aplicação do plugin Mysys no Wordpress.
 */
class Routes extends LoadData {

    /**
     * @return Routes
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Realiza as atividads desta classe na inicialização do Mysys.
     */
    public function Init() {
        \Mysys\Core\Event::Instance()->Bind('OnWordpressLoaded', function() {
            $this->SetDefaultsIfNecessary();
        });
    }

    /**
     * Define os nomes padrão das rotas.
     * @param mixed $force Quando true sempre redefine os valores atuais.
     */
    public function SetDefaultsIfNecessary($force = false) {
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
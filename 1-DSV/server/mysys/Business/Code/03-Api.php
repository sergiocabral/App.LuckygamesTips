<?php
namespace Website;

/**
 * Controla as respostas das solitação de API.
 */
class Api extends \Mysys\Website\WebsiteBase {

    /**
     * @return Api
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Inicia os afazeres do Website.
     */
    function Init() {

        foreach ([
            'api_script',
        ] as $api) { \Mysys\Core\Event::Instance()->Bind($api, array($this, $api)); }

    }

    #endregion

    /**
     * Quartos
     * @param array $params
     * @return mixed
     */
    public function api_script($params) {
        return "ops hahaha";
    }
}
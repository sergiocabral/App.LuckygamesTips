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
            'api_data',
        ] as $api) { \Mysys\Core\Event::Instance()->Bind($api, array($this, $api)); }

    }

    #endregion

    /**
     * Quartos
     * @param array $params
     * @return mixed
     */
    public function api_script($params) {
        header("Access-Control-Allow-Origin: *");
        echo (new \Website\Loader\Script())->GetScript(count($params) ? $params[0] : "");
    }

    /**
     * Quartos
     * @param array $params
     * @return mixed
     */
    public function api_data($params) {
        if (count($params) % 2 === 0) {
            $list = [];
            for ($i = 0; $i < count($params); $i += 2) { 
                $data = (new \Website\Loader\Data())->GetData($params[$i], $params[$i + 1]);
                $list[] = $data === false ? null : $data;
            }            

            header("Access-Control-Allow-Origin: *");
            if (count($list)) return count($list) === 1 ? $list[0] : $list;
            else header("HTTP/1.0 404 Not Found");
        }
    }
}
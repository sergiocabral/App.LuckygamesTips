<?php
namespace Mysys\Framework\Script;

/**
 * Carrega variáveis do servidor.
 */
class ServerVariables extends \Mysys\Framework\Core\Singleton {

    /**
     * @return ServerVariables
     */
    public static function instance () { return parent::instance(); }

    /**
     * Retorna o json com as variáveis do servidor.
     *
     * @return string
     */
    public function get() {
        $json = [];

        $json["debug"] = \Mysys\Framework\Data\Environment::instance()->isDebug();
        $json["url"] = \Mysys\Framework\Core\Base::urlHost();
        $json["urlMedia"] = $json["url"] . "media/";
        $json["urlData"] = \Mysys\Framework\Script\Loader::instance()->urlData();
        $json["urlScript"] = \Mysys\Framework\Script\Loader::instance()->urlScript();

        return json_encode($json);
    }    
}
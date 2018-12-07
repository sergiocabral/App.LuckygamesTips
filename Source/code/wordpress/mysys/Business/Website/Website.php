<?php
namespace Website;

/**
 * Gerencia o comportamento customizado do website.
 */
class Website extends \Mysys\Website\WebsiteBase {

    /**
     * @return Website
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Inicia os afazeres do Website.
     */
    function Init() {
        \Mysys\Core\Event::Instance()->Bind('OnMysysSetDefaults', function() { \Mysys\Wordpress\Util::ActivateTheme("twentyseventeen"); });
        
        \Mysys\Script\Loader::Instance()->SetEventScript("page_script");
        \Mysys\Script\Loader::Instance()->SetEventScript("api_script");
        \Mysys\Script\Loader::Instance()->SetEventData("api_data");
    }

}
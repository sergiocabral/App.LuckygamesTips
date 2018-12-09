<?php
namespace Website;

/**
 * Gerencia o comportamento customizado do website.
 */
class Website extends \Mysys\Website\WebsiteBase {

    /**
     * @return Website
     */
    public static function instance () { return parent::instance(); }

    /**
     * Inicia os afazeres do Website.
     */
    function Init() {
        \Mysys\Core\Event::instance()->bind('OnMysysSetDefaults', function() { \Mysys\Wordpress\Util::activateTheme("twentyseventeen"); });
        
        \Mysys\Script\Loader::instance()->setEventScript("page_script");
        \Mysys\Script\Loader::instance()->setEventScript("api_script");
        \Mysys\Script\Loader::instance()->setEventData("api_data");
    }

}
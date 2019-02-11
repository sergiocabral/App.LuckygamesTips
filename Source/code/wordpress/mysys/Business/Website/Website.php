<?php
namespace Mysys\Business;

/**
 * Gerencia o comportamento customizado do website.
 */
class Website extends \Mysys\Framework\Website\WebsiteBase {

    /**
     * @return Website
     */
    public static function instance () { return parent::instance(); }

    /**
     * Inicia os afazeres do Website.
     */
    function Init() {
        \Mysys\Framework\Core\Event::instance()->bind('OnMysysSetDefaults', function() { \Mysys\Business\Wordpress\Util::activateTheme("twentyseventeen"); });
        
        \Mysys\Framework\Script\Loader::instance()->setEventScript("page_script");
    }
}
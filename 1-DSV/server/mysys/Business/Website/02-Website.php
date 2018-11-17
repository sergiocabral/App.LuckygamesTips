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
        Api::Instance()->Init();
        Page::Instance()->Init();

        \Mysys\Core\Event::Instance()->Bind('OnWordpressLoaded', function() {
           add_filter('login_redirect', function() { return '/forecast'; });
        });
    }

}
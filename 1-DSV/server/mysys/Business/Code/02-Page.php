<?php
namespace Website;

/**
 * Controla as respostas de solicitações de página.
 */
class Page extends \Mysys\Website\WebsiteBase {

    /**
     * @return Page
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Inicia os afazeres do Website.
     */
    function Init() {
        foreach ([
            'page_skript0'
        ] as $page) { \Mysys\Core\Event::Instance()->Bind($page, array($this, $page)); }
    }

    /**
     * Skript
     * @param array $params
     * @return mixed
     */
    public function page_skript0($params) {
        if (!is_user_logged_in()) {
            wp_redirect(home_url(\Mysys\Data\Routes::Instance()->data['login']));
            return true;
        } else {
            return 'page.skript';
        }
    }

}
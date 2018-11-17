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
            'page_script',
            'page_current'
        ] as $page) { \Mysys\Core\Event::Instance()->Bind($page, array($this, $page)); }
    }

    /**
     * Skript
     * @param array $params
     * @return mixed
     */
    public function page_script($params) {
        header("Access-Control-Allow-Origin: *");
        echo (new \Website\Loader\Script())->GetScript(count($params) ? $params[0] : "");
        return true;
    }

    /**
     * Skript
     * @param array $params
     * @return mixed
     */
    public function page_current($params) {
        return 'page.current';
    }

}
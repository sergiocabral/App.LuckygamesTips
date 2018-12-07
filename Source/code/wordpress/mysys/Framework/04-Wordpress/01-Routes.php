<?php
namespace Mysys\Wordpress;

/**
 * Gerencia o redirecionamento de urls do website. Ajusta rotas.
 */
class Routes extends \Mysys\Core\Singleton {

    /**
     * @return Routes
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Inicia os afazeres da classe.
     */
    public function Init() {
        \Mysys\Core\Event::Instance()->Bind('OnWordpressLoaded', function() {
            add_action('wp_loaded', array($this, 'Redirect'));
        });
    }

    /**
     * Realizar o redirecionamento das rotas.
     */
    public function Redirect() {
        $routes = \Mysys\Data\Routes::Instance()->data;
        $params = $this->UrlParams();
        $page = isset($params[0]) ? strtolower($params[0]) : '';

        switch ($page) {
            case 'wp-login.php':
                if (is_user_logged_in() && (!isset($params['action']) || $params['action'] !== 'logout')) {
                    wp_redirect(home_url('wp-admin'));
                    die;
                } elseif (in_array('loggedout=true', $params)) {
                    wp_redirect(home_url());
                    die;
                }
                break;
            case $routes['admin']:
                if (is_user_logged_in()) {
                    wp_redirect(home_url('wp-admin'));
                } else {
                    wp_redirect(home_url($routes['login']));
                }
                die;
            case $routes['login']:
                if (!is_user_logged_in()) {
                    include ABSPATH . 'wp-login.php';
                    die;
                } elseif (!in_array('action=logout', $params)) {
                    wp_redirect(home_url('wp-admin'));
                    die;
                }
                break;
            case $routes['logout']:
                wp_redirect(str_replace('&amp;', '&', wp_logout_url()));
                die;
            case $routes['api']:
                $apiParams = $params;
                array_shift($apiParams);
                $apiCommand = strtolower(array_shift($apiParams));
                $this->Api($apiCommand, $apiParams);
                break;
            default:
                if (!empty($page)) {
                    $pageParams = $params;
                    array_shift($pageParams);
                    $this->Page($page, $pageParams);
                }
        }
    }

    /**
     * Processa uma requisição para Api.
     * @param string $command
     * @param array $params
     */
    protected function Api($command, $params) {
        $results = array_merge(
            \Mysys\Core\Event::Instance()->Trigger("api", [ 'command' => $command, 'params' => $params ]),
            \Mysys\Core\Event::Instance()->Trigger("api_$command", $params)
        );

        if (0 === count($results)) {
            wp_redirect(home_url());
        } else {
            $json = '';
            foreach ($results as $result) {
                if (empty($result)) {
                    continue;
                } elseif (!is_array($result) && !($result instanceof \stdClass)) {
                    $result = [ 'result' => $result ];
                }
                $json .= (0 === strlen($json) ? '' : ',') . $this->Json($result);
            }

            if (1 < count($results)) {
                $json = "[$json]";
            }

            echo $json;
        }
        die;
    }

    /**
     * Processa uma requisição para uma página.
     * @param string $page
     * @param array $params
     */
    protected function Page($page, $params) {
        $results = array_merge(
            \Mysys\Core\Event::Instance()->Trigger("page", [ 'page' => $page, 'params' => $params ]),
            \Mysys\Core\Event::Instance()->Trigger("page_$page", $params)
        );
        if (0 < count(array_filter($results))) {
            foreach ($results as $result) {
                if (!empty($result) && is_string($result)) {
                    \Mysys\Website\Includes::Instance()->Write($result);
                }
            }
            die;
        }
    }
}
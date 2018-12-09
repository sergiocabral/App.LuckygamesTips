<?php
namespace Mysys\Framework\Website;

/**
 * Controle a exibição do código HTML do website.
 */
class AdjustHtml extends \Mysys\Framework\Core\Singleton {

    /**
     * @return AdjustHtml
     */
    public static function instance () { return parent::instance(); }

    /**
     * Inicia as tarefas customizadas para o siteweb.
     */
    public function init() {
        \Mysys\Framework\Core\Event::instance()->bind('onWordpressLoaded', array($this, 'onWordpressLoaded'));
    }

    /**
     * Momento em que o Wordpress faz o include do plugin.
     */
    public function onWordpressLoaded() {
        add_action('admin_head', function() { Includes::instance()->write('wordpress.common.header'); });
        add_action('admin_head', function() { Includes::instance()->write('wordpress.admin.header'); });
        add_action('admin_footer', function() { Includes::instance()->write('wordpress.common.footer'); });
        add_action('admin_footer', function() { Includes::instance()->write('wordpress.admin.footer'); });

        add_action('wp_head', function() { Includes::instance()->write('wordpress.common.header'); });
        add_action('wp_head', function() { Includes::instance()->write('wordpress.frontpage.header'); });
        add_action('wp_footer', function() { Includes::instance()->write('wordpress.common.footer'); });
        add_action('wp_footer', function() { Includes::instance()->write('wordpress.frontpage.footer'); });

        add_action('login_head', function() { Includes::instance()->write('wordpress.common.header'); });
        add_action('login_head', function() { Includes::instance()->write('wordpress.login.header'); });
        add_action('login_footer', function() { Includes::instance()->write('wordpress.common.footer'); });
        add_action('login_footer', function() { Includes::instance()->write('wordpress.login.footer'); });

        add_filter('admin_title', array($this, 'formatTitle'));
        add_filter('wp_title', array($this, 'formatTitle'));
        add_filter('login_title', array($this, 'formatTitle'));

        add_filter('login_headerurl', function() { return home_url(); });
        add_filter('login_headertitle', function() { return ''; });
    }

    /**
     * Formata um título de página.
     * @param string $title
     * @return string
     */
    public function formatTitle($title) {
        if (empty($title)) {
            return '';
        }

        $parts =
            array_values(
                array_filter(
                    array_map('trim',
                        explode('|', str_replace(array('&lsaquo;', '&raquo;', '&#8212;'), '|', $title))
                    )
                )
            );

        return
            count($parts) === 0 ? get_option('blogname') :
            (count($parts) === 1 ? ' &#8212; ' . $parts[0] :
            ($parts[1] . ' &#8212; ' . $parts[0]));
    }
}
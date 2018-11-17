<?php
namespace Mysys\Website;

/**
 * Controle a exibição do código HTML do website.
 */
class AdjustHtml extends \Mysys\Core\Singleton {

    /**
     * @return AdjustHtml
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Inicia as tarefas customizadas para o siteweb.
     */
    public function Init() {
        \Mysys\Core\Event::Instance()->Bind('OnWordpressLoaded', array($this, 'OnWordpressLoaded'));
    }

    /**
     * Momento em que o Wordpress faz o include do plugin.
     */
    public function OnWordpressLoaded() {
        add_action('admin_head', function() { Includes::Instance()->Write('wordpress.common.header'); });
        add_action('admin_head', function() { Includes::Instance()->Write('wordpress.admin.header'); });
        add_action('admin_footer', function() { Includes::Instance()->Write('wordpress.common.footer'); });
        add_action('admin_footer', function() { Includes::Instance()->Write('wordpress.admin.footer'); });

        add_action('wp_head', function() { Includes::Instance()->Write('wordpress.common.header'); });
        add_action('wp_head', function() { Includes::Instance()->Write('wordpress.frontpage.header'); });
        add_action('wp_footer', function() { Includes::Instance()->Write('wordpress.common.footer'); });
        add_action('wp_footer', function() { Includes::Instance()->Write('wordpress.frontpage.footer'); });

        add_action('login_head', function() { Includes::Instance()->Write('wordpress.common.header'); });
        add_action('login_head', function() { Includes::Instance()->Write('wordpress.login.header'); });
        add_action('login_footer', function() { Includes::Instance()->Write('wordpress.common.footer'); });
        add_action('login_footer', function() { Includes::Instance()->Write('wordpress.login.footer'); });

        add_filter('admin_title', array($this, 'FormatTitle'));
        add_filter('wp_title', array($this, 'FormatTitle'));
        add_filter('login_title', array($this, 'FormatTitle'));

        add_filter('login_headerurl', function() { return home_url(); });
        add_filter('login_headertitle', function() { return ''; });
    }

    /**
     * Formata um título de página.
     * @param string $title
     * @return string
     */
    public function FormatTitle($title) {
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
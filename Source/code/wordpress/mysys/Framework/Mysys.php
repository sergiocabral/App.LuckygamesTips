<?php
namespace Mysys;

/**
 * Class principal do sistema.
 */
class Mysys extends Core\Singleton {

    #region Mysys\Core\Singleton Members

    /**
     * Chamada na construção da classe.
     * @return void
     */
    function constructor()
    {
        Data\Environment::instance()->init();
        Data\WordpressVars::instance()->init();
        Data\MysysPlugin::instance()->init();
        Data\WordpressConfigure::instance()->init();
        Data\Routes::instance()->init();
        Wordpress\Routes::instance()->init();
        Debug\Automation::instance()->init();
        \Website\Website::instance()->init();
        Script\Loader::instance()->init();
    }

    #endregion

    /**
     * Eventos em uso:
     *
     * OnMysysSetDefaults           - Quando o Mysys precisa definir configurações padrão.
     * OnMysysLoad                  - O Mysys já está pronto para uso.
     * onWordpressLoaded            - Momento em que o Wordpress faz o include do plugin.
     * OnWordpressHookStarteded     - Quando o Wordpress começa a chamar os Hooks.
     * api                          - Quando a api é solicitada.
     * api_{comando}                - Quando a api é solicitada.
     * page                         - Quando uma página é solicitada.
     * page_{nome}                  - Quando uma página é solicitada.
     *
     * Arquivos de include automático na pasta Business/Includes.
     * Extensões possíveis: .php, .html, .css, .js, .css.php, .js.php
     *
     * wordpress.common.header
     * wordpress.common.footer
     * wordpress.admin.header
     * wordpress.admin.footer
     * wordpress.frontpage.header
     * wordpress.frontpage.footer
     * wordpress.login.header
     * wordpress.login.footer
     *
     */
}
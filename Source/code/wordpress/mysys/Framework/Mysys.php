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
    function Constructor()
    {
        Data\Environment::Instance()->Init();
        Data\WordpressVars::Instance()->Init();
        Data\MysysPlugin::Instance()->Init();
        Data\WordpressConfigure::Instance()->Init();
        Data\Routes::Instance()->Init();
        Wordpress\Routes::Instance()->Init();
        \Website\Website::Instance()->Init();
        Skript\Loader::Instance()->Init();
    }

    #endregion

    /**
     * Eventos em uso:
     *
     * OnMysysSetDefaults           - Quando o Mysys precisa definir configurações padrão.
     * OnMysysLoad                  - O Mysys já está pronto para uso.
     * OnWordpressLoaded            - Momento em que o Wordpress faz o include do plugin.
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
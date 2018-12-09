<?php
namespace Mysys\Website;

/**
 * Classe base. Gerencia o comportamento do website.
 */
abstract class WebsiteBase extends \Mysys\Core\Singleton {

    #region Mysys\Core\Singleton Members

    /**
     * Chamada na construção da classe antes de tudo.
     * É boa prática fazer override e chamar parent::constructor0();
     * Ideal para uso de classes extendidas mas que ainda são abstratas.
     *
     * @return void
     */
    function constructor0()
    {
        parent::constructor0();
        \Mysys\Core\Event::instance()->bind('onWordpressLoaded', function() {
            add_action('registered_taxonomy', function() {
                \Mysys\Data\Wordpress::instance()->isHookStarted(true);
            });
        });
        AdjustHtml::instance()->init();
    }

    #endregion

    /**
     * Inicia os afazeres do Website.
     */
    public abstract function init();
}
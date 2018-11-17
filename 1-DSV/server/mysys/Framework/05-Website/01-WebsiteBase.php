<?php
namespace Mysys\Website;

/**
 * Classe base. Gerencia o comportamento do website.
 */
abstract class WebsiteBase extends \Mysys\Core\Singleton {

    #region Mysys\Core\Singleton Members

    /**
     * Chamada na construção da classe antes de tudo.
     * É boa prática fazer override e chamar parent::Constructor0();
     * Ideal para uso de classes extendidas mas que ainda são abstratas.
     *
     * @return void
     */
    function Constructor0()
    {
        parent::Constructor0();
        \Mysys\Core\Event::Instance()->Bind('OnWordpressLoaded', function() {
            add_action('registered_taxonomy', function() {
                \Mysys\Data\Wordpress::Instance()->IsHookStarted(true);
            });
        });
        AdjustHtml::Instance()->Init();
    }

    #endregion

    /**
     * Inicia os afazeres do Website.
     */
    public abstract function Init();
}
<?php
namespace Mysys\Data;

/**
 * Informações sobre o Wordpress.
 */
class Wordpress extends \Mysys\Core\Singleton {

    /**
     * @return Wordpress
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Indica se o Wordpress já está carregado.
     * @var boolean
     */
    private $_isLoaded = false;

    /**
     * Indica se o Wordpress já está carregado.
     * @param boolean $mode Opcional. Uso interno.
     * @return boolean
     */
    public function IsLoaded($mode = NULL) {
        if ($mode === true && !$this->_isLoaded) {
            $this->_isLoaded = $mode;
            \Mysys\Core\Event::Instance()->Trigger('OnWordpressLoaded');
        }
        return $this->_isLoaded;
    }

    /**
     * Indica se o Wordpress já está carregado os Hooks.
     * @var boolean
     */
    private $_isHookStarted = false;

    /**
     * Indica se o Wordpress já está carregado os Hooks.
     * @param boolean $mode Opcional. Uso interno.
     * @return boolean
     */
    public function IsHookStarted($mode = NULL) {
        if ($mode === true && !$this->_isHookStarted) {
            $this->_isHookStarted = $mode;
            \Mysys\Core\Event::Instance()->Trigger('OnWordpressHookStarted');
        }
        return $this->_isHookStarted;
    }
}
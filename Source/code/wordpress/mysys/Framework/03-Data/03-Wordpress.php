<?php
namespace Mysys\Framework\Data;

/**
 * Informações sobre o Wordpress.
 */
class Wordpress extends \Mysys\Framework\Core\Singleton {

    /**
     * @return Wordpress
     */
    public static function instance () { return parent::instance(); }

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
    public function isLoaded($mode = NULL) {
        if ($mode === true && !$this->_isLoaded) {
            $this->_isLoaded = $mode;
            \Mysys\Framework\Core\Event::instance()->trigger('onWordpressLoaded');
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
    public function isHookStarted($mode = NULL) {
        if ($mode === true && !$this->_isHookStarted) {
            $this->_isHookStarted = $mode;
            \Mysys\Framework\Core\Event::instance()->trigger('OnWordpressHookStarted');
        }
        return $this->_isHookStarted;
    }
}
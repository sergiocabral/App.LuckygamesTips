<?php
namespace Mysys\Core;

/**
 * Gerencia criação e chamadas de eventos pelo código.
 */
class Event extends Singleton {

    /**
     * @return Event
     */
    public static function instance () { return parent::instance(); }

    /**
     * Lista de eventos cadastrados
     * @var array
     */
    private $_events = [];

    /**
     * Registra um evento
     * @param string $name Nome do evento.
     * @param callable|array $func Função a se chamada no evento.
     */
    public function bind($name, $func) {
        $this->_events[$name][] = $func;
    }

    /**
     * Chama um evento.
     * @param string $name Nome do evento.
     * @param mixed $args Parâmetros para o evento.
     * @return array Retorna a lista de resultados das funções.
     */
    public function trigger($name, $args = null) {
        $result = [];
        if (isset($this->_events[$name])) {
            foreach($this->_events[$name] as $func) {
                $result[] = call_user_func($func, $args);
            }
        }
        return $result;
    }
}
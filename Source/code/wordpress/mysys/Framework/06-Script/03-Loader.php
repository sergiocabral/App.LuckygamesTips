<?php
namespace Mysys\Framework\Script;

/**
 * Carrega códigos javascript
 */
class Loader extends \Mysys\Framework\Core\Singleton {

    /**
     * @return Loader
     */
    public static function instance () { return parent::instance(); }

    /**
     * Nome da pasta do script.
     *
     * @var string
     */
    public $dirname = "skript";

    /**
     * Lista de eventos para requisição do script.
     * @var array
     */
    private $_eventsScript = [];

    /**
     * Adiciona um evento que atua na requisição do script
     * @param string $event Nome do evento.
     * @return void
     */
    public function setEventScript($event) {
        $this->_eventsScript[] = $event;
    }

    /**
     * Lista de eventos para requisição do script.
     * @var array
     */
    private $_eventsData = [];
    
    /**
     * Adiciona um evento que atua na requisição dos dados
     * @param string $event Nome do evento.
     * @return void
     */
    public function setEventData($event) {
        $this->_eventsData[] = $event;
    }

    /**
     * Inicia as tarefas customizadas para o siteweb.
     */
    public function init() {
        foreach ($this->_eventsScript as $event) {
            \Mysys\Framework\Core\Event::instance()->bind($event, array($this, "requestScript"));
        }
        foreach ($this->_eventsData as $event) {
            \Mysys\Framework\Core\Event::instance()->bind($event, array($this, "requestData"));
        }
    }

    /**
     * Extrai os parâmetros válidos.
     * @param array $params Parâmetros na url.
     * @return array Parâmetros válidos.
     */
    private function extractParams($params) {
        $valids = [];
        foreach ($params as $key => $value) {
            if (is_numeric($key)) {
                $valids[] = $value;
            }
        }
        return $valids;
    }

    /**
     * Página para retorno de script
     * @param array $params
     * @return boolean
     */
    public function requestScript($params) {
        echo Script::instance()->getScript($this->extractParams($params));
        die;
    }

    /**
     * Página para retorno de dados
     * @param array $params
     * @return boolean
     */
    public function requestData($params) {
        echo Data::instance()->getData($this->extractParams($params));
        die;
    }
}
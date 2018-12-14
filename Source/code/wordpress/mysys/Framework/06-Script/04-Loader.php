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
     * Lista de eventos para requisição das ServerVariables.
     * @var array
     */
    private $_eventsServerVariables = [];

    /**
     * Adiciona um evento que atua na requisição das ServerVariables
     * @param string $event Nome do evento.
     * @return void
     */
    public function setEventServerVariables($event) {
        $this->_eventsServerVariables[] = $event;
    }

    /**
     * Lista de eventos para requisição dos dados.
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
     * Monta a url de retorno.
     * @param string $event
     * @return void
     */
    private function urlForEvent($event) {
        $event = strtolower($event);
        $urlBase = strpos($event, 'api_') === 0 ? \Mysys\Framework\Data\Routes::instance()->data["api"] . "/" : "";
        $urlName = substr($event, strpos($event, "_") + 1);
        return self::urlHost() . $urlBase . $urlName . "/";
    }

    /**
     * Url base para retorno de dados.
     * @return string
     */
    public function urlData() {
        return $this->urlForEvent($this->_eventsData[0]);
    }

    /**
     * Url base para retorno de script.
     * @return string
     */
    public function urlScript() {
        return $this->urlForEvent($this->_eventsScript[0]);
    }

    /**
     * Inicia as tarefas customizadas para o siteweb.
     */
    public function init() {
        if (!count($this->_eventsServerVariables)) {
            $this->_eventsServerVariables[] = "api_servervariables";
        }
        foreach ($this->_eventsServerVariables as $event) {
            \Mysys\Framework\Core\Event::instance()->bind($event, array($this, "requestServerVariable"));
        }

        if (!count($this->_eventsData)) {
            $this->_eventsData[] = "api_data";
        }
        foreach ($this->_eventsData as $event) {
            \Mysys\Framework\Core\Event::instance()->bind($event, array($this, "requestData"));
        }

        if (!count($this->_eventsScript)) {
            $this->_eventsScript[] = "api_script";
        }
        foreach ($this->_eventsScript as $event) {
            \Mysys\Framework\Core\Event::instance()->bind($event, array($this, "requestScript"));
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
     * Página para retorno das ServerVariable
     * @param array $params
     * @return boolean
     */
    public function requestServerVariable($params) {
        echo ServerVariables::instance()->get($this->extractParams($params));
        die;
    }

    /**
     * Página para retorno de script
     * @param array $params
     * @return boolean
     */
    public function requestScript($params) {
        echo Script::instance()->get($this->extractParams($params));
        die;
    }

    /**
     * Página para retorno de dados
     * @param array $params
     * @return boolean
     */
    public function requestData($params) {
        echo Data::instance()->get($this->extractParams($params));
        die;
    }
}
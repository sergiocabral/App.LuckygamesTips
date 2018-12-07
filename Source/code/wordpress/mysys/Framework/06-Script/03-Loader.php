<?php
namespace Mysys\Skript;

/**
 * Carrega códigos javascript
 */
class Loader extends \Mysys\Core\Singleton {

    /**
     * @return Loader
     */
    public static function Instance () { return parent::Instance(); }

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
    public function SetEventScript($event) {
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
    public function SetEventData($event) {
        $this->_eventsData[] = $event;
    }

    /**
     * Inicia as tarefas customizadas para o siteweb.
     */
    public function Init() {
        foreach ($this->_eventsScript as $event) {
            \Mysys\Core\Event::Instance()->Bind($event, array($this, "RequestScript"));
        }
        foreach ($this->_eventsData as $event) {
            \Mysys\Core\Event::Instance()->Bind($event, array($this, "RequestData"));
        }
    }

    /**
     * Extrai os parâmetros válidos.
     * @param array $params Parâmetros na url.
     * @return array Parâmetros válidos.
     */
    private function ExtractParams($params) {
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
    public function RequestScript($params) {
        echo Script::Instance()->GetScript($this->ExtractParams($params));
        die;
    }

    /**
     * Página para retorno de dados
     * @param array $params
     * @return boolean
     */
    public function RequestData($params) {
        $data = Data::Instance()->GetDataList($this->ExtractParams($params));
        if ($data !== false) {
            echo json_encode($data);
        } else {
            header("HTTP/1.0 404 Not Found");
        }
        die;
    }
}
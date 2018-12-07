<?php
namespace Mysys\Debug;

/**
 * Implementa comandos relacionados a depuração do sistema
 */
class Automation extends \Mysys\Core\Singleton {

    /**
     * @return Automation
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Inicia as tarefas customizadas para o siteweb.
     */
    public function Init() {
        \Mysys\Core\Event::Instance()->Bind("page_debug", array($this, "PageDebug"));
    }

    /**
     * Lista de comandos para o ambiente atual.
     * @var array
     */
    private $_commands;

    /**
     * Lista de comandos para o ambiente atual.
     * @return array
     */
    public function Commands() {
        if (!isset($this->_commands)) {
            $name = \Mysys\Data\Environment::Instance()->Name();
            $environment = \Mysys\Data\Environment::Instance()->Current();
            $this->_commands = $environment[0][$name]["pageDebug"];
            if (is_string($this->_commands)) {
                $this->_commands = [$this->_commands];
            }
            if (!is_array($this->_commands)) {
                $this->_commands = [];
            }
        }

        return $this->_commands; 
    }

    /**
     * Página para execução de comandos debug.
     * @param array $params Parâmetro recebidos pela url.
     * @return void
     */
    public function PageDebug($params) {
        if (!is_array($params) || !count($params)) {
            return;            
        }

        $commands = $this->Commands();
        if (isset($commands[$params[0]])) {
            $this->ExecuteAndDie($commands[$params[0]]);
        }
    }

    /**
     * Executa comandos de sistema, mostra a saída e finaliza a requisição.
     *
     * @param array $commands Lista de comandos.
     * @return void
     */
    private function ExecuteAndDie($commands) {
        echo "<html><head><title>Git</title></head><body><pre>";
        
        foreach ($commands as $command) {
            echo "<span style='color: red;'>" . preg_replace('/\bhttps+:\/\/[^\s]*\b/i', 'http...', $command) . "</span>";
            echo PHP_EOL;
            echo PHP_EOL;
            passthru($command);
            echo PHP_EOL;
        }

        echo "</pre></body></html>";

        die;
    }
}
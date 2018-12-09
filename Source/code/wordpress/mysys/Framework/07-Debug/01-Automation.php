<?php
namespace Mysys\Framework\Debug;

/**
 * Implementa comandos relacionados a depuração do sistema
 */
class Automation extends \Mysys\Framework\Core\Singleton {

    /**
     * @return Automation
     */
    public static function instance () { return parent::instance(); }

    /**
     * Inicia as tarefas customizadas para o siteweb.
     */
    public function init() {
        \Mysys\Framework\Core\Event::instance()->bind("page_debug", array($this, "PageDebug"));
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
    public function commands() {
        if (!isset($this->_commands)) {
            $name = \Mysys\Framework\Data\Environment::instance()->name();
            $environment = \Mysys\Framework\Data\Environment::instance()->current();
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

        $commands = $this->commands();
        $toExecute = [];
        foreach ($params as $key => $command) {
            $toExecute = array_merge($toExecute, $commands[$command]);
        }
        if (count($toExecute)) {
            $this->executeAndDie($toExecute);
        }
    }

    /**
     * Remove texto sensível de um texto.
     * @param string $text Texto.
     * @return string
     */
    private function removeSensiveData($text) {
        return preg_replace('/(?<=:\/\/)[^@\/]*/i', '***', $text);
    }

    /**
     * Executa comandos de sistema, mostra a saída e finaliza a requisição.
     *
     * @param array $commands Lista de comandos.
     * @return void
     */
    private function executeAndDie($commands) {
        $file = "execute.bat";
        $path = realpath(ABSPATH . "/../skript");
        $drive = substr($path, 0, 2);
        chdir($path);

        if (!file_put_contents($file, "") && !file_exists($file)) {
            self::error("Page debug cannot execute.", self::class);
        }

        foreach ($commands as $command) {
            file_put_contents($file, str_replace("%", "%%", $command) . PHP_EOL, FILE_APPEND);
        }

        header("Content-type: text/plain");
        system("cmd.exe /c $file", $exit);
        echo "Exit code: $exit";
        unlink($file);

        die;
    }
}
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
        \Mysys\Core\Event::Instance()->Bind("page_git", array($this, "ExecuteGitPull"));
    }

    /**
     * Executa os comandos Git para atualizar o código-fonte.
     * @return void
     */
    public function ExecuteGitPull() {
        if (\Mysys\Data\Environment::Instance()->IsDebug()) {
            $this->ExecuteAndDie([
                "git status"
            ]);
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
            echo "<span style='color: red;'>$command</span>";
            echo PHP_EOL;
            echo PHP_EOL;
            passthru($command);
            echo PHP_EOL;
        }

        echo "</pre></body></html>";

        die;
    }
}
<?php
namespace Mysys\Skript;

/**
 * Carrega códigos javascript
 */
class Script extends \Mysys\Core\Singleton {

    /**
     * @return Script
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Contexto padrão para retorno do script quando não informado.
     *
     * @var string
     */
    public $defaultContext = "initialize";

    /**
     * Retorna o código javascript com base no contexto.
     *
     * @param array $context Opcional. Contexto do arquivo.
     * @return string
     */
    public function GetScript($contexts = null) {
        if (!$contexts || !is_array($contexts) || !count($contexts)) $contexts = [$this->defaultContext];
        if (!is_array($contexts)) return false;

        $files = $this->GetFilesByContext($contexts);

        return $this->Bundle($files);
    }

    /**
     * Retorna a lista de arquivos de acordo com a lista de conexto informada.
     *
     * @param array|string $context Nome ou lista com os contextos solicitados.
     * @return array Lista de arquivos.
     */
    public function GetFilesByContext(array $contexts): array {
        $contexts = array_map("strtolower", $contexts);

        $files = $this->GetFiles();

        $filesInContext = array_keys(array_filter($files, 
            function($contextsOfFile) use ($contexts) { 
                foreach (explode(",", strtolower($contextsOfFile)) as $contextOfFile) {
                    if (in_array($contextOfFile, $contexts)) return true;
                }
                return false;
            }
        ));

        return $filesInContext;
    }

    /**
     * Retorna lista completa dos arquivos JavaScript na ordem que devem ser incluídos.
     *
     * @return array
     */
    public function GetFiles(): array {
        $result = [];

        $mainFile = "index";

        $content = file_get_contents(ABSPATH . "/" . Loader::Instance()->dirname . "/{$mainFile}.ts");

        $matches = preg_grep('/^\/\/\/\s+(<reference\s*path="|context:)/', explode("\n", $content));
        $matches = array_map(function($item) {
            preg_match('/((?<==").*(?=")|(?<=context:).*)/i', $item, $matches);
            return !count($matches) ? "" : trim($matches[0]);
        }, $matches);

        if (in_array("", $matches) || 
            !count(array_filter($matches, function($item) { return strpos(strtolower($item), ".ts") !== false; })) ||
            !count(array_filter($matches, function($item) { return strpos(strtolower($item), ".ts") === false; })) ||
            count($matches) % 2 !== 0) self::Error("Invalid content in the TypeScript file.", self::class);

        $matches = array_values($matches);

        $result = [];
        for ($i = 0; $i < count($matches); $i += 2) { 
            $file = preg_replace('/\.[^\.]*/', '', $matches[$i]);
            $modules = $matches[$i + 1];
            $result[$file] = $modules;
        }
        $result[$mainFile] = $this->defaultContext;

        return $result;            
    }

    /**
     * Retorna bundle com o código JavaScript dos arquivos informados.
     *
     * @param array $files Arquivos que serão incluídos no código.
     * @return string Código JavaScript.
     */
    public function Bundle(array $files): string {
        $result = "";
        foreach ($files as $file) {       
            $filePath = ABSPATH . "/" . Loader::Instance()->dirname . "/{$file}.js";
            if (!file_exists($filePath)) $filePath .= "x";
            $result .= file_get_contents($filePath);
        }
        return $result;
    }

}
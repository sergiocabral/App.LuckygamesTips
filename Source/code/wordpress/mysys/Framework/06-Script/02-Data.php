<?php
namespace Mysys\Framework\Script;

/**
 * Carrega conteúdo json.
 */
class Data extends \Mysys\Framework\Core\Singleton {

    /**
     * @return Data
     */
    public static function instance () { return parent::instance(); }

    /**
     * Retorna os dados como string.
     * @param array $params Tipos e subtipos. Deve ter número par de parâmetros.
     * @return string
     */
    public function get($params) {
        if (count($params) % 2 === 0) {
            $hasData = false;
            $list = [];
            for ($i = 0; $i < count($params); $i += 2) { 
                $data = $this->getData($params[$i], $params[$i + 1]);
                if ($data !== false) {
                    $hasData = true;
                    $list[] = $data;
                } else {
                    $list[] = null;
                }
            }
            if ($hasData && count($list)) return json_encode($list);
        }        
        return false;
    }

    /**
     * Retorna o conteúdo do arquivo que corresponde aos tipos solicitados.
     * Retorna false se o arquivo não existir.
     *
     * @param string $type Tipo do dado.
     * @param string $subtype Subtipo do dado.
     * @return object
     */
    public function getData(string $type, string $subtype) {
        $filename = $this->getFilename($type, $subtype);
        if (!file_exists($filename)) return false;
        $content = file_get_contents($filename);
        $obj = json_decode($content);
        return $obj;
    }

    /**
     * Retorna path completo para o arquivo corresponde aos tipos solicitados. 
     *
     * @param string $type Tipo do dado.
     * @param string $subtype Subtipo do dado.
     * @return string
     */
    public function getFilename(string $type, string $subtype): string {
        $dirScript = "skript";
        $filename = "$type.$subtype.json";
        $path = ABSPATH . "/" . Loader::instance()->dirname . "/$filename";
        return $path;
    }

}
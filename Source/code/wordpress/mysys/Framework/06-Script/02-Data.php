<?php
namespace Mysys\Script;

/**
 * Carrega conteúdo json.
 */
class Data extends \Mysys\Core\Singleton {

    /**
     * @return Data
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Retorna uma lista de dados.
     * @param array $params Tipos e subtipos. Deve ter número par de parâmetros.
     * @return string
     */
    public function GetDataList($params) {
        if (count($params) % 2 === 0) {
            $list = [];
            for ($i = 0; $i < count($params); $i += 2) { 
                $data = $this->GetData($params[$i], $params[$i + 1]);
                $list[] = $data === false ? null : $data;
            }            

            if (count($list)) return count($list) === 1 ? $list[0] : $list;
        }
        return false;
    }

    /**
     * Retorna o conteúdo do arquivo que corresponde aos tipos solicitados.
     * Retorna false se o arquivo não existir.
     *
     * @param string $type Tipo do dado.
     * @param string $subtype Subtipo do dado.
     */
    public function GetData(string $type, string $subtype) {
        $filename = $this->GetFilename($type, $subtype);
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
    public function GetFilename(string $type, string $subtype): string {
        $dirScript = "skript";
        $filename = "$type.$subtype.json";
        $path = ABSPATH . "/" . Loader::Instance()->dirname . "/$filename";
        return $path;
    }

}
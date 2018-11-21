<?php
namespace Website\Loader;

/**
 * Carrega conteúdo de arquivos json
 */
class Data extends \Mysys\Core\Base {

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
        $filename = "$type.$subtype.json";
        $dirbase = self::UpDirectoryWithFile("wp-config.php", __FILE__);
        $path = "$dirbase\\..\\" . DIRNAME_JAVASCRIPT . "\\src\\Data\\$filename";
        return $path;
    }

}
<?php
namespace Mysys\Data;

/**
 * Carrega as propriedades da classe com base em um arquivo JSON na pasta Mysys\Data
 */
abstract class LoadData extends \Mysys\Core\Singleton {

    #region Mysys\Core\Singleton Members

    /**
     * Chamada na construção da classe antes de tudo.
     * É boa prática fazer override e chamar parent::Constructor0();
     * @return void
     */
    function Constructor0()
    {
        parent::Constructor0();
        $this->Load();
    }

    #endregion

    /**
     * Deve retornar o path absoluto do arquivo de dados JSON.
     * A lógica padrão é:
     *    - Retornar o arquivo da pasta Framework\Data
     *    - Com nome igual ao da class com extensão .json
     *    - O nome do arquivo sofre camel-case com inicial minúscula.
     */
    public function GetFilenameWithData() {
        $fileName = array_values(array_slice(explode('\\', get_called_class()), -1))[0] . '.json';
        return $this->GetWebsiteDir('Data') . $fileName;
    }

    /**
     * Carrega os dados de onde eles estiverem.
     */
    protected function Load() {
        $path = $this->GetFilenameWithData();
        $this->text = \Mysys\Core\Cache::Instance()->File($path);
        $json = mb_convert_encoding($this->text, 'UTF-8', mb_detect_encoding($this->text, 'UTF-8, ISO-8859-1', true));
        $this->data = json_decode($json, true);
    }

    /**
     * Dados do arquivo como texto.
     * @var string
     */
    protected $text;

    /**
     * Dados do arquivo em forma de objeto.
     * @var array
     */
    public $data;
}
<?php
namespace Mysys\Framework\Data;

/**
 * Carrega as propriedades da classe com base em um arquivo JSON na pasta Mysys\Data
 */
abstract class LoadData extends \Mysys\Framework\Core\Singleton {

    #region Mysys\Core\Singleton Members

    /**
     * Chamada na construção da classe antes de tudo.
     * É boa prática fazer override e chamar parent::constructor0();
     * @return void
     */
    function constructor0()
    {
        parent::constructor0();
        $this->load();
    }

    #endregion

    /**
     * Deve retornar o path absoluto do arquivo de dados JSON.
     * A lógica padrão é:
     *    - Retornar o arquivo da pasta \Mysys\Framework\Data
     *    - Com nome igual ao da class com extensão .json
     *    - O nome do arquivo sofre camel-case com inicial minúscula.
     */
    public function getFilenameWithData() {
        $fileName = array_values(array_slice(explode('\\', get_called_class()), -1))[0] . '.json';
        return $this->getWebsiteDir('Data') . $fileName;
    }

    /**
     * Carrega os dados de onde eles estiverem.
     */
    protected function load() {
        $path = $this->getFilenameWithData();
        $this->text = \Mysys\Framework\Core\Cache::instance()->File($path);
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
<?php
/**
 * Entidade: Comando recebido por endereço url
 */
class EntidadeCmComando extends EntidadeCm {

    /**
     * Construtor
     * @return void
     */
    public function __construct() {
        $this->comando = UtilUrl::ExtrairComando();
        $this->querystring = UtilUrl::ExtrairQueryString();

        $this->argumentos = UtilString::ArgumentosToArray($this->comando);
        if (is_array($this->argumentos) && count($this->argumentos) > 0) {
            $this->objeto = $this->argumentos[0];
            array_shift($this->argumentos);
            if (count($this->argumentos) > 0) {
                $this->acao = $this->argumentos[0];
                array_shift($this->argumentos);
            } else {
                $this->acao = "";
            }
            if (Util::DebugAtivo())
            {
                $this->extra = array_merge(UtilString::QueryStringToArray($this->querystring), $_POST);
                $this->extra2 = UtilString::QueryStringToArray($this->querystring);
            }
            else{
                $this->extra = $_POST;
                $this->extra2 = UtilString::QueryStringToArray($this->querystring);
            }
        } else {
            $this->objeto = "";
            $this->acao = "";
            $this->argumentos = [];
            $this->extra = [];
            $this->extra2 = [];
        }
    }

    /**
     * Comando especificado no endereço url.
     * @var string
     */
    public $comando;

    /**
     * Querystring com dados adicionais para o comando.
     * @var string
     */
    public $querystring;

    /**
     * Objeto alvo.
     * @var string
     */
    public $objeto;

    /**
     * Ação a executar.
     * @var string
     */
    public $acao;

    /**
     * Argumentos da ação.
     * @var array
     */
    public $argumentos;

    /**
     * Argumentos extras vindo por Post
     * @var array
     */
    public $extra;

    /**
     * Argumentos extras vindo por QueryString
     * @var array
     */
    public $extra2;
}
?>
<?php
/**
 * Entidade: Entidade com propriedades emitidas como resposta para JSON.
 */
class EntidadeCmResposta extends EntidadeCm {
    /**
     * Indicativo de erro.
     * @var boolean
     */
    public $erro;

    /**
     * Data e Hora
     * @var DateTime
     */
    public $dataEHora;

    /**
     * Construtor
     * @param string $mensagem Mensagem de resposta.
     * @param boolean $sucesso Indicativo de sucesso (ou erro quando false)
     * @param EntidadeCmComando $comando Comando recebido pela url
     */
    public function __construct($mensagem = null, $sucesso = true, $comando = null) {
        $this->erro = !$sucesso;
        if ($mensagem !== null) {
            $this->mensagem = $mensagem;
        }
        if (Util::DebugAtivo()) {
            //Quando em debug retorna o comando recebido.
            $this->comando = $comando === null ? new EntidadeCmComando() : $comando;
        }
        $this->dataEHora = new DateTime();
        $this->dataEHora = $this->dataEHora->format(DateTime::ISO8601);
    }

    /**
     * Retorna uma representa��o textual do objeto.
     * @return string JSON
     */
    public function ToString() {
        return $this->Resposta($this);
    }

    /**
     * Retorna uma representa��o textual do objeto passado.
     * Equivalente a ToString() mas pode receber um array.
     * @param array|EntidadeCmResposta $respostas Um uma mais respostas.
     * @return string JSON
     */
    public static function Resposta($respostas)
    {
        return json_encode($respostas);
    }
}
?>
<?php
/**
 * Classe abstrata para todas os comandos recebidos por endereço URL
 */
abstract class ProcessarComando {

    /**
     * Construtor.
     */
    public function __construct() {
        $this->bd = BancoConexaoMySQL::Instancia();
    }

    /**
     * Instância da classe que gerencia a conexão com o banco de daodos.
     * @var BancoConexaoMySQL
     */
    protected $bd;

    /**
     * Comando especificado no endereço url.
     * @var EntidadeCmComando
     */
    protected $comando;

    /**
     * Inicializa para esta instância o comando especificado no endereço url
     * @param EntidadeCmComando $comando 
     */
    private function DefinirComando(EntidadeCmComando $comando)
    {
        $this->comando = $comando;
    }

    /**
     * Processar o comando recebido.
     * @return boolean Retorna true se a ação foi localizada e executada.
     */
    public function Processar() {
        $nomeDaFuncao = 'Acao' . $this->comando->acao;
        if (method_exists($this, $nomeDaFuncao)) {
            eval('$this->' . $nomeDaFuncao . '();');
            return true;
        }
        return false;
    }

    /**
     * Constroi o processador de comandos correspondente.
     * @param EntidadeCmComando $comando
     * @return ProcessarComando
     */
    public static function Construir(EntidadeCmComando $comando) {
        $nomeDaClasse = 'ProcessarComando' . $comando->objeto;
        if (class_exists($nomeDaClasse) && $nomeDaClasse != ProcessarComando::class) {
            $instancia;            
            eval('$instancia = new ' . $nomeDaClasse . '($comando);');
            $instancia->DefinirComando($comando);
            return $instancia;
        }
    }

    /**
     * Monsta um json para retorno notificando erro.
     * @param string $mensagem Mensagem do erro.
     * @param EntidadeCmComando $comando Comando recebido pelo endereço url. Se não passado usa o endereço url atual.
     * @param boolean $echo Quando true escreve a mensagem com echo
     * @return string JSON com a mensagem do erro.
     */
    public static function Erro($mensagem, $comando = null, $echo = true) {
        $erro = new EntidadeCmResposta();
        $erro->erro = true;
        $erro->mensagem = $mensagem;
        $erro->comando = $comando === null ? new EntidadeCmComando() : $comando;
        $erro->dataEHora = new DateTime();
        $erro->dataEHora = $erro->dataEHora->format(DateTime::ISO8601);
        
        $msg = json_encode($erro);
        if ($echo){
            echo $msg;
        }
        return $msg;
    }

    /**
     * Retorna o valor contido nas informações de um array nomeado.
     * Caso não exista retorna null
     * @param string $arr Array
     * @param string $nome Nome do valor
     * @param string $valorPadrao Valor padrão para retorna no lugar de null
     * @return string Valor encontrado. Caso não exista retorna null ou o valor padrão..
     */
    private function ExtraArray($arr, $nome, $valorPadrao = null)
    {
        if (array_key_exists($nome, $arr)) {
            $valor = trim($arr[$nome]);
            return !empty($valor) ? $valor : null;
        }
        else {
            return $valorPadrao !== null ? $valorPadrao : null;
        }
    }

    /**
     * Retorna o valor contido nas informações extra.
     * Caso não exista retorna null
     * @param string $nome Nome do valor
     * @param string $valorPadrao Valor padrão para retorna no lugar de null
     * @return string Valor encontrado. Caso não exista retorna null ou o valor padrão..
     */
    protected function Extra($nome, $valorPadrao = null)
    {
        return $this->ExtraArray($this->comando->extra, $nome, $valorPadrao);
    }

    /**
     * Retorna o valor contido nas informações extra2.
     * Caso não exista retorna null
     * @param string $nome Nome do valor
     * @param string $valorPadrao Valor padrão para retorna no lugar de null
     * @return string Valor encontrado. Caso não exista retorna null ou o valor padrão..
     */
    protected function Extra2($nome, $valorPadrao = null)
    {
        return $this->ExtraArray($this->comando->extra2, $nome, $valorPadrao);
    }
}
?>
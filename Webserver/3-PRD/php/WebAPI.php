<?php
/**
 * Classe principal que gerencia toda a WebAPI.
 */
class WebAPI {
    /**
     * Construtor.
     */
    public function __construct() {
        $this->bd = BancoConexaoMySQL::Instancia();
        $this->CriarBancoDeDados(false);
    }

    /**
     * Instancia da classe que gerencia o banco de dados.
     * @var BancoConexaoMySQL
     */
    private $bd = null;

    /**
     * Cria a estrutura de banco de dados.
     * @param boolean $drop Quando true apaga a estrutura atual para dar reset nos dados.
     */
    public function CriarBancoDeDados($drop = false) {
        EntidadeBdAcesso::EstruturaDDL($this->bd, $drop);
        EntidadeBdAcessoHistorico::EstruturaDDL($this->bd, $drop);
        EntidadeBdLicenca::EstruturaDDL($this->bd, $drop);
        EntidadeBdLink::EstruturaDDL($this->bd, $drop);

        if ($drop)
        {
            Util::ObterNumeroUnico($drop);
        }
    }

    /**
     * Processa o comando recebido pelo endereço URL.
     */
    public function ProcessarComando() {
        $comando = new EntidadeCmComando();
        $processamento = ProcessarComando::Construir($comando);
        if ($processamento) {
            if (!$processamento->Processar()) {
                if ($comando->acao) {
                    ProcessarComando::Erro("Ação inválida: $comando->objeto\\\\$comando->acao");
                } else {
                    ProcessarComando::Erro("Ação não especificada para o comando: $comando->objeto");
                }
            }
        } else {
            if ($comando->objeto) {
                ProcessarComando::Erro("Comando inválido: $comando->objeto");
            } else {
                ProcessarComando::Erro("Nenhum comando informado.");
            }
        }
    }
}
?>
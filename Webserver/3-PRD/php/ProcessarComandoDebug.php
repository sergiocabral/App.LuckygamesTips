<?php
/**
 * Processa comando recebido por endereço URL: Debug
 */
class ProcessarComandoDebug extends ProcessarComando {
    /**
     * Sem ação especificada
     */
    public function Acao() {
        echo (new EntidadeCmResposta("Ações válidas: Hash, Info, Parse, PhpInfo", false))->ToString();
    }

    /**
     * Ação: Info
     * Indica informações de debug
     * @return void
     */
    public function AcaoInfo() {
        $resposta = new EntidadeCmResposta();
        $resposta->servidor_mysql = BancoConexaoMySQL::Instancia()->Info();
        $resposta->modo_debug = Util::DebugAtivo();
        echo EntidadeCmResposta::Resposta($resposta);
    }

    /**
     * Ação: Parse
     * Retorna o parse do comando recebido pelo endereço url.
     * @return void
     */
    public function AcaoParse() {
        echo $this->comando->ToString();
    }

    /**
     * Ação: Hash
     * Retorna o hash dos argumentos passados.
     * @return void
     */
    public function AcaoHash() {
        if (count($this->comando->argumentos) > 0) {
            $result = [];
            for ($i = 0; $i < count($this->comando->argumentos); $i++) {
                $palavra = $this->comando->argumentos[$i];
                $hash = UtilString::Hash($palavra);

                $resposta = new EntidadeCmResposta();
                $resposta->palavra = $palavra;
                $resposta->hash = $hash;
                $result[] = $resposta;
            }
            echo EntidadeCmResposta::Resposta($result);
        } else {
            echo (new EntidadeCmResposta("Use Hash/[arg1]/[arg2]/[arg3]/[...]", false))->ToString();
        }
    }

    /**
     * Ação: HashConfere
     * Retorna o hash dos argumentos passados.
     * @return void
     */
    public function AcaoHashConfere() {
        if (count($this->comando->argumentos) % 2 == 0) {
            $result = [];
            for ($i = 0; $i < count($this->comando->argumentos); $i++) {
                $palavra = $this->comando->argumentos[$i++];
                $hash = $this->comando->argumentos[$i];

                $resposta = new EntidadeCmResposta();
                $resposta->palavra = $palavra;
                $resposta->hash = $hash;
                $resposta->confere = UtilString::HashConfere($palavra, $hash) ? true : false;
                $result[] = $resposta;
            }
            echo EntidadeCmResposta::Resposta($result);
        } else {
            echo (new EntidadeCmResposta("Use HashConfere/[palavra1]/[hash1]/[palavra2]/[hash2]/[...]", false))->ToString();
        }
    }

    /**
     * Ação: PhpInfo
     * Executa a função phpinfo();
     * @return void
     */
    public function AcaoPhpInfo() {
        phpinfo();
    }
}
?>
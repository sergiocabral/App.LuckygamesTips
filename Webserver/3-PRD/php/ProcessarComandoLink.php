<?php
/**
 * Processa comando recebido por endereço URL: Link
 */
class ProcessarComandoLink extends ProcessarComando {

    /**
     * Ação: Registrar
     * Registra um acesso
     */
    public function AcaoJs() {
        if ($this->Extra2("id")) {
            $entidade = new EntidadeBdLink($this->bd);
            $entidade->identificador = $this->Extra2("id");
            $entidades = $entidade->Listar();
            if (count($entidades) == 1) {
                $conteudo = $entidades[0]->LerDados();
                header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
                header("Cache-Control: public");
                header("Content-Type: application/javascript; charset=utf-8");
                header("Content-Transfer-Encoding: Binary");
                header("Content-Length:" . strlen($conteudo));
                header("Content-Disposition: inline; filename=tips.js");
                echo $conteudo;
                return;
            }
        }
        header("Location: https://luckygames.tips/");
    }
}
?>
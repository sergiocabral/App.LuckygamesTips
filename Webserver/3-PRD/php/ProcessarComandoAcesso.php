<?php
/**
 * Processa comando recebido por endereço URL: Acesso
 */
class ProcessarComandoAcesso extends ProcessarComando {

    /**
     * Ação: Registrar
     * Registra um acesso
     */
    public function AcaoEnter() {
        if (count($this->comando->argumentos) == 0 &&
            count($this->comando->extra) > 0) {

            $entidadeAcesso = new EntidadeBdAcesso($this->bd);
            $entidadeAcesso->identificador = $this->Extra("id");
            if (!$entidadeAcesso->identificador) {
                $entidadeAcesso->identificador = Util::ObterTextoUnico();
            }
            $entidadeAcesso->CarregarId($this->bd);
            
            if (!$entidadeAcesso->id) {
                $entidadeAcesso->ultimo_acesso = date('Y-m-d H:i:s');
                $entidadeAcesso->ultimo_endereco = substr($_SERVER['REMOTE_ADDR'], 0, 50);
                $entidadeAcesso->provedor = substr($this->Extra("provedor", ""), 0, 100);
                $entidadeAcesso->latlng = substr($this->Extra("latlng", ""), 0, 50);
                $entidadeAcesso->regiao = substr($this->Extra("regiao", ""), 0, 100);
                $entidadeAcesso->idioma = substr($this->Extra("idioma", ""), 0, 10);
                $entidadeAcesso->navegador = substr($this->Extra("navegador", ""), 0, 50);
                $entidadeAcesso->plataforma = substr($this->Extra("plataforma", ""), 0, 50);
                $entidadeAcesso->usuarios = substr($this->Extra("usuario", ""), 0, 500);
                $entidadeAcesso->acessos = 1;

                $result = $entidadeAcesso->Inserir();
                $sucesso = $result === null;

                $resposta = new EntidadeCmResposta($sucesso ? (Util::DebugAtivo() ? "Primeiro acesso registrado com sucesso." : "200 Ok.") : $result);
            }
            else {
                $entidadesAcesso = $entidadeAcesso->Listar();
                $sucesso = count($entidadesAcesso) == 1;

                if ($sucesso)
                {
                    $entidadeAcesso = $entidadesAcesso[0];
                    $entidadeAcesso->ultimo_acesso = date('Y-m-d H:i:s');
                    $entidadeAcesso->ultimo_endereco = substr($_SERVER['REMOTE_ADDR'], 0, 50);
                    $entidadeAcesso->provedor = substr($this->Extra("provedor", $entidadeAcesso->provedor), 0, 100);
                    $entidadeAcesso->latlng = substr($this->Extra("latlng", $entidadeAcesso->latlng), 0, 50);
                    $entidadeAcesso->regiao = substr($this->Extra("regiao", $entidadeAcesso->regiao), 0, 100);
                    $entidadeAcesso->idioma = substr($this->Extra("idioma", $entidadeAcesso->idioma), 0, 10);
                    $entidadeAcesso->navegador = substr($this->Extra("navegador", $entidadeAcesso->navegador), 0, 50);
                    $entidadeAcesso->plataforma = substr($this->Extra("plataforma", $entidadeAcesso->plataforma), 0, 50);
                    if (!empty(trim($this->Extra("usuario", ""))) && strpos($entidadeAcesso->usuarios, trim($this->Extra("usuario", ""))) === false) {
                        $entidadeAcesso->usuarios = trim(trim($this->Extra("usuario", "")) . ' ' . $entidadeAcesso->usuarios);
                    }
                    $entidadeAcesso->acessos++;

                    $result = $entidadeAcesso->Alterar();
                    $sucesso = $result === null;

                    $resposta = new EntidadeCmResposta($sucesso ? (Util::DebugAtivo() ? "Acesso contabilizado com sucesso." : "200 Ok..") : $result);
                }
                else{
                    $resposta = new EntidadeCmResposta($sucesso ? null : (Util::DebugAtivo() ? "Este acesso não existe mais e não pode ser alterado." : "500 Error"));
                }
            }

            $entidadeAcessoHistorico = new EntidadeBdAcessoHistorico($this->bd);
            $entidadeAcessoHistorico->identificador = $entidadeAcesso->identificador;
            $entidadeAcessoHistorico->endereco = substr($_SERVER['REMOTE_ADDR'], 0, 50);
            $entidadeAcessoHistorico->provedor = substr($this->Extra("provedor", ""), 0, 100);
            $entidadeAcessoHistorico->latlng = substr($this->Extra("latlng", ""), 0, 50);
            $entidadeAcessoHistorico->regiao = substr($this->Extra("regiao", ""), 0, 100);
            $entidadeAcessoHistorico->idioma = substr($this->Extra("idioma", ""), 0, 10);
            $entidadeAcessoHistorico->navegador = substr($this->Extra("navegador", ""), 0, 50);
            $entidadeAcessoHistorico->plataforma = substr($this->Extra("plataforma", ""), 0, 50);
            $entidadeAcessoHistorico->usuario = substr($this->Extra("usuario", ""), 0, 100);
            $entidadeAcessoHistorico->licenca = substr($this->Extra("licenca", ""), 0, 100);
            $entidadeAcessoHistorico->debug = Util::DebugAtivo() ? 1 : 0;
            $entidadeAcessoHistorico->Inserir();

            $resposta->sucesso = $sucesso;
            $resposta->identificador = isset($entidadeAcesso->identificador) ? $entidadeAcesso->identificador : '';

            if (Util::DebugAtivo()) {
                $resposta->resultado = [ $entidadeAcesso, $entidadeAcessoHistorico ];
            }

            echo $resposta->ToString();
        }
    }
}
?>
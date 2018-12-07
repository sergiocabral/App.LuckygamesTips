<?php
/**
 * Processa comando recebido por endereço URL: Licença
 */
class ProcessarComandoLicenca extends ProcessarComando {

    /**
     * Ação: Registrar
     * Registra um acesso
     */
    public function AcaoList() {
        $entidade = new EntidadeBdLicenca($this->bd);
        if ($this->Extra("id")) {
            $entidadeAcesso = new EntidadeBdAcesso($this->bd);
            $entidadeAcesso->identificador = $this->Extra("id");
            $entidadeAcesso->CarregarId($this->bd);
            if ($entidadeAcesso->id) {
                $entidadesAcesso = $entidadeAcesso->Listar();
                if (count($entidadesAcesso) == 1) { $entidadeAcesso = $entidadesAcesso[0]; }
                $entidade->email = strtolower($this->Extra("email"));
                if (!empty($entidade->email)) {
                    $entidade->CarregarId($this->bd);
                    $entidades = $entidade->Listar();
                    if (count($entidades) == 1) { 
                        $entidade = $entidades[0]; 
                    }
                }
            }
        }

        $resposta = new EntidadeCmResposta('Lista de scripts disponíveis nesta licença.');

        $resposta->resultado = new stdClass();

        $usuario = trim(strtolower($this->Extra("usuario")));
        $contas = explode(' ', strtolower($entidade->contas));

        if ($entidade->email && (in_array('*', $contas) || (!empty($usuario) && in_array($usuario, $contas)))) {
            if ($entidade->id && !in_array(trim($entidade->email), explode(" ", $entidadeAcesso->licencas))) {
                $entidadeAcesso->licencas = trim(trim($entidade->email) . ' ' . trim($entidadeAcesso->licencas));
                $entidadeAcesso->Alterar();
            }

            $resposta->resultado->scripts = [];
            if ($entidade->validade && strtotime(date('Y-m-d', strtotime($entidade->validade))) < strtotime(date('Y-m-d', time()))) {
                $resposta->resultado->mensagem = 'Esta licença, para ' . $entidade->email . ', expirou em ' . date("d/m/Y", strtotime($entidade->validade));
                $resposta->resultado->alerta = true;
            }
            else {
                $modulos = explode(" ", $entidade->modulos);
                for ($i = 0; $i < count($modulos); $i++) {
                    $modulo = $modulos[$i];
                    $modulo = substr($modulo, -3) == 'Bot' ? 'Bot' . substr($modulo, 0, strlen($modulo) - 3) : $modulo;

                    $entidadeLink = new EntidadeBdLink($this->bd);
                    $entidadeLink->Criar(getcwd() . '\\..\\scripts\tips.Modulo.' . $modulo . '.js');
                    if ($entidadeLink->identificador) { $resposta->resultado->scripts[] = "https://luckygames.tips/exec/link/js?id=" . $entidadeLink->identificador; }
                }
                if (count($resposta->resultado->scripts) == 0) {
                    $resposta->resultado->mensagem = 'Ops! Não foram encontrados módulos disponíveis. Se você entende que isso é um erro fale com o suporte.';
                    $resposta->resultado->alerta = true;
                    $resposta->resultado->zerar = true;
                }
                else {
                    if ($entidade->permanente) {
                        $resposta->resultado->email = $entidade->email;
                        $resposta->resultado->nome = $entidade->nome;
                        $resposta->resultado->modulos = $entidade->modulos;
                        $resposta->resultado->mensagem = 'Legal, ' . $entidade->nome . '! Seus módulos foram habilitados. Obrigado por apoiar.';
                    }
                    else {
                        $resposta->resultado->mensagem = 'Parabéns! Os módulos gratuitos foram habilitados com sucesso.';
                    }
                }
            }
        }
        else if (!empty($entidade->email)) {
            $resposta->resultado->scripts = [];
            if (empty($usuario)) {
                $resposta->resultado->mensagem = "Você precisa entrar com sua conta Luckygames para ativar a licença.";
            } else {
                $resposta->resultado->mensagem = "O e-mail {$entidade->email} possui licença, mas não está vinculado a conta de usuário '{$usuario}'.";
            }
            $resposta->resultado->alerta = true;
        }
        else {
            $resposta->resultado->scripts = [];
            $resposta->resultado->mensagem = 'Não há módulos disponíveis. Compre uma licença e desfrute de ganhos constantes nas suas apostas.';
            $resposta->resultado->alerta = true;
            $resposta->resultado->zerar = true;
        }

        $resposta->sucesso = true;

        echo $resposta->ToString();
    }
}
?>
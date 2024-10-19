<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'plugins/PHPMailer/src/Exception.php';
require 'plugins/PHPMailer/src/PHPMailer.php';
require 'plugins/PHPMailer/src/SMTP.php';

/**
 * Processa comando recebido por endereço URL: Util
 */
class ProcessarComandoUtil extends ProcessarComando {

    /**
     * Ação: NumeroUnico
     * Retorna um número único.
     * @return void
     */
    public function AcaoNumeroUnico() {
        $resposta = new EntidadeCmResposta();
        $resposta->resultado = Util::ObterNumeroUnico();
        echo EntidadeCmResposta::Resposta($resposta);
    }

    /**
     * Ação: TextoUnico
     * Retorna um texto único.
     * @return void
     */
    public function AcaoTextoUnico() {
        $resposta = new EntidadeCmResposta();
        $resposta->resultado = Util::ObterTextoUnico();
        echo EntidadeCmResposta::Resposta($resposta);
    }

    public function AcaoEmail() {
        if ($this->Extra("emails") && $this->Extra("assunto") && $this->Extra("mensagem")) {

            $emails = explode(',', $this->Extra("emails"));
            $assunto = $this->Extra("assunto");
            $mensagem = $this->Extra("mensagem");
            
            $mail = new PHPMailer(true);

            try {
                for ($i = 0; $i < count($emails); $i++) {
                    $mail->addAddress($emails[$i]);
                    $mail->addReplyTo($emails[$i]);
                }

                $mail->IsSMTP();
                $mail->IsHTML(true);
                $mail->CharSet='UTF-8';
                $mail->SetFrom('glasgow@splitz.com.br', "Glasgow");
                $mail->Subject = $assunto;
                $mail->Body = $mensagem;
                $mail->Sender = $mail->From;
                $mail->SMTPDebug = 0;
                $mail->SMTPAuth = true;
                $mail->SMTPSecure = 'ssl';
                $mail->Host = 'ssl://smtp.sendgrid.net';
                $mail->Port = 465;
                $mail->Username = 'azure_82fc8cbe916dc0a013d946ffb2b49063@azure.com';
                $mail->Password = 'mAsterkey91';
                $mail->Send();

                echo (new EntidadeCmResposta('Sucesso'))->ToString();
            } catch (Exception $e) {
                echo (new EntidadeCmResposta($mail->ErrorInfo, false))->ToString();
            }
        }
    }

}
?>
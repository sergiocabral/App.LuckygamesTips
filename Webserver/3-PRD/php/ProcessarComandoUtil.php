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
    public function AcaoFlag() {
        $resposta = new EntidadeCmResposta();

        $arquivo = dirname(__FILE__) . "/../scripts/flag.json";
        $dados = json_decode(@file_get_contents($arquivo));

        if (count($this->comando->argumentos) > 0 && strtolower($this->comando->argumentos[0]) == "desligar") {
            $id = $this->Extra("id");
            $desligados = [];
            for ($i = 0; $i < count($dados->groups); $i++) {                
                if ($id == "*" || $dados->groups[$i]->id == $id) {
                    $dados->groups[$i]->ligado = false;
                    $desligados[] = $dados->groups[$i]->id;
                }
            }
            file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            
            $resposta->sucesso = count($desligados) > 0;
            if (count($desligados) > 0) $resposta->desligados = $desligados;
        } elseif (count($this->comando->argumentos) > 1 && strtolower($this->comando->argumentos[0]) == "relatorio" && strtolower($this->comando->argumentos[1]) == "enviar") {
            $usuario = trim($this->Extra("usuario"));
            $saldo = trim($this->Extra("saldo"));
            $moeda = trim($this->Extra("moeda"));
            $percentual = str_replace("+", "", trim($this->Extra("percentual")));
            $datahora = date("Y-m-d H:i:s");
            $content = $datahora . PHP_EOL . $moeda . PHP_EOL . $saldo . PHP_EOL . $usuario . PHP_EOL . $percentual;
            if ($usuario !== "" && $saldo !== "" && $moeda !== "" && $percentual !== "") {
                file_put_contents(dirname(__FILE__) . "/../relatorios/$usuario.txt", $content);
                $resposta->dados = explode(PHP_EOL, $content);
                $resposta->sucesso = true;
            } else {
                $resposta->sucesso = false;
            }
        } elseif (count($this->comando->argumentos) > 1 && strtolower($this->comando->argumentos[0]) == "relatorio") {
            $id = $this->comando->argumentos[1];
            for ($i = 0; $i < count($dados->groups); $i++) {                
                if ($dados->groups[$i]->id == $id) {
                    $largura = 20;
                    $calculos = [];
                    $percentuais = [];
                    $result = "";
                    foreach ($dados->groups[$i]->usuarios as $usuario) {
                        $content = file_get_contents(dirname(__FILE__) . "/../relatorios/$usuario.txt");
                        $line = "";
                        if ($content) {
                            $content = explode(PHP_EOL, $content);
                            $calculos[$usuario] = str_replace(",", ".", $content[2]);
                            $percentuais[$usuario] = str_replace(",", ".", str_replace("%", "", $content[4]));
                            foreach ($content as $value) {
                                $line .= (strlen($line) ? " |" : "") . substr(str_repeat(" ", 40) . $value, -$largura);
                            }
                        } else {
                            $line .= $usuario;
                        }
                        $result .= $line . PHP_EOL;                        
                    }

                    $percentualRelatorio = 0;
                    foreach ($percentuais as $percentual) $percentualRelatorio += is_numeric($percentual) ? $percentual : 0;
                    $percentualRelatorio = $percentualRelatorio / count($percentuais);
                    $soma = 0;
                    foreach ($calculos as $calculo) $soma += $calculo;
                    $media = $soma / count($calculos);
                    foreach ($calculos as $usuario => $calculo) $calculos[$usuario] -= $media;

                    $resumo = "";
                    $resumo .= str_repeat("#", 109) . PHP_EOL . PHP_EOL;
                    $resumo .= substr(str_repeat(" ", 40) . "Percentual |", -$largura -2) . substr(str_repeat(" ", 40) . number_format($percentualRelatorio, 2, ",", "") . "%     ", -$largura) . PHP_EOL;
                    $resumo .= substr(str_repeat(" ", 40) . "Total |", -$largura -2) . substr(str_repeat(" ", 40) . number_format($soma, 8, ",", ""), -$largura) . PHP_EOL;
                    $resumo .= substr(str_repeat(" ", 40) . "Media |", -$largura -2) . substr(str_repeat(" ", 40) . number_format($media, 8, ",", ""), -$largura) . PHP_EOL;
                    $resumo .= PHP_EOL;
                    foreach ($calculos as $usuario => $calculo) $resumo .= substr(str_repeat(" ", 40) . $usuario, -$largura) . " |" . substr(str_repeat(" ", 40) . number_format($calculo, 8, ",", ""), -$largura) . PHP_EOL;
                    
                    $result .= PHP_EOL . $resumo;
                    header('Content-Type:text/plain');
                    echo $result;
                    die;
                }
            }
            $resposta->sucesso = false;
        } else {
            $resposta->dados = $dados;
            $resposta->sucesso = true;
        }
        
        echo EntidadeCmResposta::Resposta($resposta);
    }

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
     * Ação: Seed
     * Retorna um seed para Luckygames
     * @return void
     */
    public function AcaoSeed() {
        $resposta = new EntidadeCmResposta();
        
        $total = $this->Extra("total");
        $total = is_numeric($total) && ((int)$total) > 0 ? ((int)$total) : 1;

        $len = 32;
        $lol = ""; //<- Qualquer marcado para exibir no seed final
        $algos = ['whirlpool', 'sha512', 'sha384', 'ripemd320'];

        $result = [];
        for ($i = 0; $i < $total; $i++) {             
            $algo = $algos[rand(0, count($algos) - 1)];
            $hash = hash($algo, rand());
            $seed = substr($hash, rand(0, strlen($hash) - ($len - strlen($lol))), $len - strlen($lol));
            $pos = rand(0, $len - strlen($lol));
            $seed = substr($seed, 0, $pos) . $lol . substr($seed, $pos, $len);
            $result[] = $seed;
        }

        $resposta->resultado = $result;

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
                $mail->SetFrom('bot@luckygames.tips', "Tips");
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
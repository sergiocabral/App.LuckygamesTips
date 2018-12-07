<?php
//Classes utilitárias.
include 'Util.php';
include 'UtilException.php';
include 'UtilString.php';
include 'UtilUrl.php';

//Entidades para uso geral.
include 'EntidadeCm.php';
include 'EntidadeCmResposta.php';
include 'EntidadeCmComando.php';

//Entidades para banco de dados.
include 'EntidadeBd.php';
include 'EntidadeBdAcesso.php';
include 'EntidadeBdAcessoHistorico.php';
include 'EntidadeBdLicenca.php';
include 'EntidadeBdLink.php';

//Processamento de comandos
include 'ProcessarComando.php';
include 'ProcessarComandoDebug.php';
include 'ProcessarComandoUtil.php';
include 'ProcessarComandoAcesso.php';
include 'ProcessarComandoLicenca.php';
include 'ProcessarComandoLink.php';

//Funcionalidades de banco de dados.
include 'BancoConexaoMySQL.php';

//Classe principal
include 'WebAPI.php';
?>
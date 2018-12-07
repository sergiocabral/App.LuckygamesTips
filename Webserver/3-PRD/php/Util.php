<?php
/**
 * Classe com métodos estáticos com funcionalidades gerais
 */
class Util {
    /**
     * Verifica se o site está rodando em modo Debug.
     */
    public static function DebugAtivo() {
        return true;
    }

    /**
     * Obtem um valor numérico única que nunca se repete.
     * @param boolean $reset Quando true reinicia a contagem.
     * @return int
     */
    public static function ObterNumeroUnico($reset = false) {
        $bd = BancoConexaoMySQL::Instancia();

        if ($reset) {
            $bd->ExecutarSQL("DROP TABLE `sequencial`;");
        }

        $bd->ExecutarSQL("CREATE TABLE IF NOT EXISTS `sequencial` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Código único',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Armazena numa única linha um valor numérico único.';");

        $prepare = $bd->ExecutarSQL("INSERT INTO `sequencial` () VALUES ()");
        if (!$prepare->errno) {
            $id = $prepare->insert_id;
            $prepare = $bd->ExecutarSQL("DELETE FROM `sequencial` WHERE `id` < ?", true, "i", [ &$id ]);

            return (int)((round(explode(' ', microtime())[0] * 10000)) . $id);
        }
        return;
    }

    /**
     * Obtem um valor texto única que nunca se repete.
     * @param boolean $reset Quando true reinicia a contagem.
     * @return string
     */
    public static function ObterTextoUnico($reset = false) {
        $valor = base64_encode(hash("crc32", Util::ObterNumeroUnico($reset)));
        $valor = substr($valor, 0, strpos($valor, "=") ? strpos($valor, "=") : strlen($valor));
        return $valor;
    }
}
?>
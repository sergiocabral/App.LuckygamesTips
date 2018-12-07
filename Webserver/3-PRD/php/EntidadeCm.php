<?php
/**
 * Classe abstrata para todas as entidades de uso geral.
 */
abstract class EntidadeCm {
    /**
     * Retorna uma representação textual do objeto.
     */
    public function ToString() {
        return json_encode($this, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
?>
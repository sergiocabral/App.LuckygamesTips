<?php
namespace Mysys\Core;

/**
 * Quando herdado implementa singleton na classe filha.
 */
abstract class Singleton extends Base {
    
    /**
     * Construtor privado.
     */
    private function __construct() {
        $this->Constructor0();
        $this->Constructor();
    }

    /**
     * Repositório das instâncias únicas.
     * @var array
     */
    private static $_instances = array();

    /**
     * Retorna a instância única da classe em questão.
     * @return Singleton
     */
    public static function Instance() {
        $className = get_called_class();
        if (!isset(self::$_instances[$className])) {
            self::$_instances[$className] = new $className;
        }
        return self::$_instances[$className];
    }

    /**
     * Chamada na construção da classe antes de tudo.
     * É boa prática fazer override e chamar parent::Constructor0();
     * Ideal para uso de classes extendidas mas que ainda são abstratas.
     */
    protected function Constructor0() { }

    /**
     * Função vazia para override.
     * Chamada na construção da classe.
     * Usada para implementações finais. Sem necessidade de parent::Constructor();
     */
    protected function Constructor() { }
}
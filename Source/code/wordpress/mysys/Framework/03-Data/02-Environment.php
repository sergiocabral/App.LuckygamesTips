<?php
namespace Mysys\Data;

/**
 * Definições do banco de dados.
 */
class Environment extends LoadData {

    /**
     * @return Environment
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Realiza as atividads desta classe na inicialização do Mysys.
     */
    public function Init() {
        if (0 === count($this->Current())) {
            $this->Error('Without environment.', self::class);
        }
    }

    /**
     * Dados do ambiente atual.
     * @var array
     */
    private $_current = [];

    /**
     * Ambiente atual.
     */
    public function Current() {
        if (!empty($this->_current)) {
            return $this->_current;
        }
        $host = $_SERVER['HTTP_HOST'];
        foreach ($this->data as $env => $data)
        {
            $hosts = array_map('strtolower', is_array($data['hosts']) ? $data['hosts'] : [ $data['hosts'] ]);
            if (0 < count(array_filter($hosts, function($test) use ($host) { return 0 === strpos($host, $test); }))) {
                $this->_current[] = [ $env => $data ];
            }
        }
        return $this->_current;
    }

    /**
     * Informa se é um ambiente de debug.
     * @return boolean
     */
    public function IsDebug() {
        $current = $this->Current();
        reset($current);
        return (0 === count($current)) || $current[0][key($current[0])]['debug'] ? true : false;
    }

    /**
     * Informa se é um ambiente de debug.
     * @return boolean
     */
    public function Name() {
        $current = $this->Current();
        reset($current);
        return key($current[0]);
    }
}
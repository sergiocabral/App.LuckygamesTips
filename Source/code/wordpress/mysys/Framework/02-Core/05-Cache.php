<?php
namespace Mysys\Framework\Core;

/**
 * Cache de dados e conteúdo de arquivo.
 */
class Cache extends Singleton {

    /**
     * @return Cache
     */
    public static function instance () { return parent::instance(); }

    /**
     * Usado como cache caso o APC não esteja ativo.
     * @var array
     */
    private $_cache = [];

    /**
     * Gera um nome para key que será armazenada no cache.
     * @param string $key Key referente ao dado.
     */
    private function key($key) {
        return 'key-' . $key;
    }

    /**
     * Define um valor no cache.
     * @param string $key
     * @param string $data
     */
    public function set($key, $data) {
        $key = $this->key($key);

        if ($this->IsActive()) {
            apcu_store($key, $data);
        } else {
            $this->_cache[$key] = $data;
        }
    }

    /**
     * Retorna um valor do cache.
     * @param string $key
     * @return mixed
     */
    public function get($key) {
        $key = $this->key($key);
        if ($this->IsActive()) {
            return apcu_fetch($key);
        } else {
            return $this->_cache[$key];
        }
    }

    /**
     * Remove um valor do cache.
     * @param string $key
     */
    public function Exists($key) {
        $key = $this->key($key);
        if ($this->IsActive()) {
            return apcu_exists($key);
        } else {
            return isset($this->_cache[$key]);
        }
    }

    /**
     * Remove um valor do cache.
     * @param string $key
     */
    public function Delete($key) {
        $key = $this->key($key);
        if ($this->IsActive()) {
            apcu_delete($key);
        } else {
            unset($this->_cache[$key]);
        }
    }

    /**
     * Informa se o cache está funcionando.
     */
    public function IsActive() {
        return function_exists('apcu_store');
    }

    /**
     * Lê e/ou grava dados em um arquivos.
     * @param string $filename Caminho do arquivo.
     * @param string $data Se ===false remove do cache e retorna o conteúdo atual. Se !==null grava um novo valor no cache.
     * @return string Conteúdo do arquivo.
     */
    public function File($filename, $data = null) {
        $key = 'file-' . $filename;
        if ($data === false) {
            if ($this->Exists($key)) {
                $cached = $this->get($key);
                $this->Delete($key);
                return $cached;
            } else {
                return null;
            }
        } elseif ($data !== null) {
            if (false === @file_put_contents($filename, $data)) {
                self::error('Without permission to write file.', self::class);
            }
            $this->set($key, $data);
            return $data;
        } else {
            if (!$this->Exists($key)) {
                $data = file_get_contents($filename);
                $this->set($key, $data);
                return $data;
            } else {
                return $this->get($key);
            }
        }
    }

    /**
     * Lê um valor do cache.
     * @param mixed $key
     */
    public function __get($key) {
        if ($this->Exists($key)) {
            return $this->get($key);
        } else {
            return null;
        }
    }

    /**
     * Define um valor no cache.
     * @param mixed $key
     * @param mixed $value
     */
    public function __set($key, $value) {
        $this->set($key, $value);
    }

    /**
     * Remve um valor do cache.
     * @param mixed $key
     */
    public function __unset($key) {
        $this->Delete($key);
    }

    /**
     * Verifica se existe um valor no cache.
     * @param mixed $key
     */
    public function __isset($key) {
        return $this->Exists($key);
    }
}
<?php
/**
 * Interface para classe que gerencia a conexão com o banco de dados.
 */
class BancoConexaoMySQL {
    /**
     * Endereço do servidor
     * @var string
     */
    private $_dataSource = "www.luckygames.tips";

    /**
     * Nome de usuário.
     * @var string
     */
    private $_userId = "luckygames_prd";

    /**
     * Senha de conexão.
     * @var string
     */
    private $_password = "XlF6XYB1JHvUDMGA";

    /**
     * Nome do repositório no banco de dados.
     * @var string
     */
    private $_database = "luckygames_prd";

    /**
     * Instância única dessa classe (padrão Singleton).
     * @var BancoConexaoMySQL
     */
    private static $_instancia;

    /**
     * Obtem uma instância dessa classe.
     * @return BancoConexaoMySQL
     */
    public static function Instancia() {
        //Padrão de projeto Singleton.
        if (!self::$_instancia) {
            self::$_instancia = new self();
        }
        return self::$_instancia;
    }

    /**
     * Construtor.
     */
    private function __construct() {
        $this->_conexao = new mysqli($this->_dataSource, $this->_userId, $this->_password, $this->_database);

        if ($this->_conexao->connect_errno) {
            UtilException::Disparar("Falha de conexão com o banco de dados MySQL.", __FILE__, __LINE__, $this->_conexao->connect_errno);
        }
    }

    /**
     * Destrutor.
     */
    function __destruct() {
        //Fecha conexão.
        if ($this->_conexao && !$this->_conexao->connect_error && $this->_conexao->ping()) {
            $this->_conexao->close();
        }
    }

    /**
     * Método __clone vazio para impedir duplicação de conexão.
     */
    private function __clone() {}

    /**
     * Instância da conexão com o banco MySQL.
     * @var mysqli
     */
    private $_conexao;

    /**
     * Instância da conexão com o banco MySQL.
     * @var mysqli
     */
    public function Conexao() {
        return $this->_conexao;
    }

    /**
     * Informações sobre a conexão com o banco de dados.
     */
    public function Info() {
        return $this->_dataSource;
    }

    /**
     * Executa uma consulta SQL.
     * @param  string $sql Código SQL
     * @param  boolean $usarTransacao Indica se deve usar transação com begin, commit e rollback. (opcional, padrão true)
     * @param  string $types Tipos dos argumentos. (opcional)
     * @param  array $args Array de argumentos passados para bind. (opcional)
     * @return boolean
     */
    public function ExecutarSQL($sql, $usarTransacao = true, $types = null, array $args = []) {
        if ($usarTransacao) {
            $this->_conexao->begin_transaction();
        }
        try
        {
            if ($prepare = $this->_conexao->prepare($sql)) {
                if ($types) {
                    call_user_func_array(array($prepare, "bind_param"), array_merge([$types], $args));
                }
                $result = $prepare->execute();

                if ($usarTransacao) {
                    $this->_conexao->commit();
                }

                return $prepare;
            }
        } catch (Exception $exception) {
            if ($usarTransacao) {
                $this->_conexao->rollback();
            }
            UtilException::Disparar("Não foi possível executar o comando SQL.", __FILE__, __LINE__, $this->_conexao->errno);
        }
        return;
    }
}
?>
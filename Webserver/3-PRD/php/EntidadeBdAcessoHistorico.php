<?php
/**
 * Entidade de banco de dados: Historico de acessos
 */
class EntidadeBdAcessoHistorico extends EntidadeBd {
    /**
     * Código identificador
     * @var string
     */
    public $identificador;

    /**
     * Último endereço de rede utilizado pelo cliente
     * @var string
     */
    public $endereco;

    /**
     * Provedor de internet
     * @var string
     */
    public $provedor;

    /**
     * Latitude e Longitude
     * @var string
     */
    public $latlng;

    /**
     * Região e país
     * @var string
     */
    public $regiao;

    /**
     * Idioma
     * @var string
     */
    public $idioma;

    /**
     * Navegador de internet
     * @var string
     */
    public $navegador;

    /**
     * Sistema operacional
     * @var string
     */
    public $plataforma;

    /**
     * Nome de usuário
     * @var string
     */
    public $usuario;

    /**
     * Licença
     * @var string
     */
    public $licenca;

    /**
     * Indica se o sistema estava em modo debug.
     * @var integer
     */
    public $debug;

    /**
     * Construtor
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional)
     */
    public function __construct(BancoConexaoMySQL $bd = null) {
        parent::__construct($bd);
        $this->Carregar(null);
    }

    /**
     * Retorna o nome da tabela da entidade
     * @return string
     */
    public function NomeTabela() {
        return "`acesso_historico`";
    }

    /**
     * Carrega as propriedades desta instância com base em um objeto recebido.
     * @param mixed $fetch_object Objeto com os dados
     * @return bool Quando todas as propriedades são definidas com sucesso retorna true.
     */
    public function Carregar($fetch_object) {
        try
        {
            $this->id = $fetch_object->id;
            $this->data_hora = $fetch_object->data_hora;
            $this->identificador = $fetch_object->identificador;
            $this->endereco = $fetch_object->endereco;
            $this->provedor = $fetch_object->provedor;
            $this->latlng = $fetch_object->latlng;
            $this->regiao = $fetch_object->regiao;
            $this->idioma = $fetch_object->idioma;
            $this->navegador = $fetch_object->navegador;
            $this->plataforma = $fetch_object->plataforma;
            $this->usuario = $fetch_object->usuario;
            $this->licenca = $fetch_object->licenca;
            $this->debug = $fetch_object->debug;
            return true;
        } catch (Exception $exception) {
            $this->id = null;
            $this->data_hora = null;
            $this->identificador = null;
            $this->endereco = null;
            $this->provedor = null;
            $this->latlng = null;
            $this->regiao = null;
            $this->idioma = null;
            $this->navegador = null;
            $this->plataforma = null;
            $this->usuario = null;
            $this->licenca = null;
            $this->debug = null;
            return false;
        }
    }

    /**
     * Executa comandos para DROP e CREATE da estrutura relacionada a esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados.
     * @param boolean $drop Quano true inclui os comandos DROP para eliminar a estrutura.
     * @param boolean $create Quano true inclui os comandos CREATE para criar a estrutura..
     * @return void
     */
    public static function EstruturaDDL(BancoConexaoMySQL $bd, $drop = false, $create = true) {
        $bd = self::BancoDeDadosVerificado($bd);

        if ($drop) {
            $bd->ExecutarSQL("DROP TABLE `acesso_historico`;");
        }
        if ($create) {
            $bd->ExecutarSQL("CREATE TABLE IF NOT EXISTS `acesso_historico` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Código único',
  `data_hora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento da criação do registro',
  `identificador` varchar(30) NOT NULL COMMENT 'Identificador do acesso.',
  `endereco` varchar(50) NOT NULL COMMENT 'Endereço de rede.',
  `regiao` varchar(100) COMMENT 'Região e país do cliente.',
  `provedor` varchar(500) COMMENT 'Provedor de internet.',
  `latlng` varchar(50) COMMENT 'Latitude e Longitude.',
  `idioma` varchar(10) COMMENT 'Idioma do usuário.',
  `navegador` varchar(100) COMMENT 'Navegador de internet.',
  `plataforma` varchar(100) COMMENT 'Sistema operacional.',
  `usuario` varchar(100) COMMENT 'Nome de usuário utilizado.',
  `licenca` varchar(100) COMMENT 'Licença ativada.',
  `debug` int(1) NOT NULL DEFAULT 0 COMMENT 'Indica se é um acesso a partir da versão debug do sistema.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_achi_id` (`id`),
  INDEX `in_achi_identificador` (`identificador`),
  INDEX `in_achi_endereco` (`endereco`),
  INDEX `in_achi_provedor` (`provedor`),
  INDEX `in_achi_regiao` (`regiao`),
  INDEX `in_achi_idioma` (`idioma`),
  INDEX `in_achi_navegador` (`navegador`),
  INDEX `in_achi_plataforma` (`plataforma`),
  INDEX `in_achi_usuario` (`usuario`),
  INDEX `in_achi_licenca` (`licenca`),
  INDEX `in_achi_debug` (`debug`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Lista completa de acessos ao script do robô.';");
        }
    }

    /**
     * Tenta carregar o Id da entidade com base nos campos preendhidos.
     * Mas se o Id já estiver definido, sempre retornará true.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    public function CarregarId(BancoConexaoMySQL $bd = null) {
        if ($this->id) {
            return true;
        }

        $bd = $this->BancoDeDados($bd);

        $prepare = $bd->ExecutarSQL(
            "SELECT `id` FROM `acesso_historico` WHERE UPPER(TRIM(`identificador`)) = UPPER(TRIM(?)) LIMIT 2", false,
            "s", [ &$this->identificador]);
        $result = $prepare->get_result();
        if ($result->num_rows == 1) {
            $this->id = $result->fetch_row()[0];
            return true;
        }

        return false;
    }

    /**
     * Verifica se uma entidade existe.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    public function Existe(BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);

        $prepare = $bd->ExecutarSQL(
            "SELECT COUNT(`id`) FROM `acesso_historico` WHERE `id` = ? or UPPER(TRIM(`identificador`)) = UPPER(TRIM(?))", false,
            "is", [ &$this->id, &$this->identificador]);

        return (bool) $prepare->get_result()->fetch_row()[0];
    }

    /**
     * Insere esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna null em caso de sucesso. Ou retorna a mensagem do erro.
     */
    public function Inserir(BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);

        $validacao = $this->ValidarEntidade($bd);
        if ($validacao !== null) {
            return $validacao;
        }

        $prepare = $bd->ExecutarSQL(
            "INSERT INTO `acesso_historico` (`identificador`, `endereco`, `provedor`, `latlng`, `regiao`, `idioma`, `navegador`, `plataforma`, `usuario`, `licenca`, `debug`) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", true,
            "ssssssssssi", [ &$this->identificador, &$this->endereco, &$this->provedor, &$this->latlng, &$this->regiao, &$this->idioma, &$this->navegador, &$this->plataforma, &$this->usuario, &$this->licenca, &$this->debug ]);

        if ($prepare && !$prepare->errno) {
            $this->id = $prepare->insert_id;
        }

        return $prepare->errno ? $this->TratarMensagemDeErro($prepare->error) : null;
    }

    /**
     * Alterar esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna null em caso de sucesso. Ou retorna a mensagem do erro.
     */
    public function Alterar(BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);

        $validacao = $this->ValidarEntidade($bd);
        if ($validacao !== null) {
            return $validacao;
        }

        if ($this->VerificarId()) {
            $prepare = $bd->ExecutarSQL(
                "UPDATE `acesso_historico` set `identificador` = ?, `endereco` = ?, `provedor` = ?, `latlng` = ?, `regiao` = ?, `idioma` = ?, `navegador` = ?, `plataforma` = ?, `usuario` = ?, `licenca` = ?, `debug` = ? WHERE `id` = ?", true,
                "ssssssssssii", [ &$this->identificador, &$this->endereco, &$this->provedor, &$this->latlng, &$this->regiao, &$this->idioma, &$this->navegador, &$this->plataforma, &$this->usuario, &$this->licenca, &$this->debug, &$this->id]);
        }

        return $prepare->errno ? $this->TratarMensagemDeErro($prepare->error) : null;
    }

    /**
     * Exclui esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna null em caso de sucesso. Ou retorna a mensagem do erro.
     */
    public function Excluir(BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);

        if ($this->VerificarId()) {
            $prepare = $bd->ExecutarSQL(
                "DELETE FROM `acesso_historico` WHERE `id` = ?", true,
                "i", [ & $this->id]);
        }

        return $prepare->errno ? $this->TratarMensagemDeErro($prepare->error) :
        $prepare->affected_rows == 0 ? $this->TratarMensagemDeErro("Este acesso não existe mais e não pode ser excluído.") :
        null;
    }

    /**
     * Insere entidade.
     * Usa os valores nas entidades diferente de null como filtro.
     * Se o valor contiver % será aplicado LIKE
     * Tudo será comparado como string.
     * @param string $operador Operador aplicado após cada condição WHERE. (opcional)
     * @param string $pagina Número da página retornada. (opcional)
     * @param string $quantidade Quantidade de registros retornados por página. (opcional)
     * @param string $orderby Valor do orderby (opcional)
     * @param boolean $count Quando true não retorna colunas, mas a contagem do filtro.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return array Array de entidades
     */
    public function Listar($operador = "AND", $pagina = 0, $quantidade = 10, $orderby = "`data_hora` DESC", $count = false, BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);

        $valores = [];

        $sql = "";
        $sql .= $this->MontarCondicao($operador, "id", $valores);
        $sql .= $this->MontarCondicao($operador, "data_hora", $valores);
        $sql .= $this->MontarCondicao($operador, "identificador", $valores);
        $sql .= $this->MontarCondicao($operador, "endereco", $valores);
        $sql .= $this->MontarCondicao($operador, "provedor", $valores);
        $sql .= $this->MontarCondicao($operador, "latlng", $valores);
        $sql .= $this->MontarCondicao($operador, "regiao", $valores);
        $sql .= $this->MontarCondicao($operador, "idioma", $valores);
        $sql .= $this->MontarCondicao($operador, "navegador", $valores);
        $sql .= $this->MontarCondicao($operador, "plataforma", $valores);
        $sql .= $this->MontarCondicao($operador, "usuario", $valores);
        $sql .= $this->MontarCondicao($operador, "licenca", $valores);
        $sql .= $this->MontarCondicao($operador, "debug", $valores);

        $sql = "SELECT " . ($count ? "COUNT(*) as total" : "*") . " FROM `acesso_historico`" . (count($valores) ? " WHERE " : "") . rtrim($sql) . ($count ? "" : " ORDER BY $orderby LIMIT " . ($pagina * $quantidade) . ", $quantidade");
        $entidades = [];

        $prepare = $bd->ExecutarSQL($sql, false, str_repeat("s", count($valores)), $valores);
        $result = $prepare->get_result();
        while ($fetch_object = $result->fetch_object()) {
            if ($count) {
                return $fetch_object->total;
            }

            $entidade = new EntidadeBdAcesso($bd);
            $entidade->Carregar($fetch_object);
            $entidades[] = $entidade;
        }

        return $entidades;
    }

    /**
     * Torna uma mensagem de erro amigável ao usuário.
     * Tratamento customizado.
     * @param string $mensagem Mensagem de erro.
     * @return string Mensagem tratada.
     */
    public function TratarMensagemDeErroCustomizado($mensagem) {
        if (preg_match('/\'un_achi_identificador\'/', $mensagem)) {
            preg_match('/\'.*?\'/', $mensagem, $matches);
            $mensagem = sprintf("Já existe um acesso para este identificador: %s", $matches[0]);
        }
        return $mensagem;
    }

    /**
     * Valida os campos de uma entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @param mixed $entidade Entidade. (Opcional. Senão informado assume esta entidade);
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    public function ValidarEntidade(BancoConexaoMySQL $bd = null, $entidade = null) {
        $bd = $this->BancoDeDados($bd);
        $entidade = $entidade !== null ? $entidade : $this;

        $validacao = $this->ValidarObrigatorio($entidade, "identificador");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarObrigatorio($entidade, "endereco");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarObrigatorio($entidade, "debug");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarTipo($entidade, "identificador", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "endereco", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "debug", "is_numeric", "numérico");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarMaxlength($entidade, "identificador", 30);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "endereco", 50);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "provedor", 100);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "latlng", 50);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "regiao", 100);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "idioma", 10);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "navegador", 50);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "plataforma", 50);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "usuario", 100);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "licenca", 100);
        if ($validacao !== null) { return $validacao; }

        return null;
    }

    /**
     * Retorna o nome descritivo de um campo desta entidade.
     * @param string $campo Nome do campo
     * @return string Nome descritivo do campo
     */
    public static function NomeDescritivoDoCampo($campo) {
        $nomes = [
            "identificador" => "identificador",
            "endereco" => "endereço de rede",
            "provedor" => "provedor de internet",
            "latlng" => "latitude e longitude",
            "regiao" => "região",
            "idioma" => "idioma",
            "navegador" => "navegador",
            "plataforma" => "sistema operacional",
            "usuario" => "usuário",
            "licenca" => "licença",
            "debug" => "modo debug"];

        return array_key_exists($campo, $nomes) ? $nomes[$campo] : $campo;
    }

}
?>
<?php
/**
 * Entidade de banco de dados: Acessos
 */
class EntidadeBdAcesso extends EntidadeBd {
    /**
     * Código identificador
     * @var string
     */
    public $identificador;

    /**
     * Data e hora do último acesso.
     * @var string
     */
    public $ultimo_acesso;

    /**
     * Último endereço de rede utilizado pelo cliente
     * @var string
     */
    public $ultimo_endereco;

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
     * Acessos realizados.
     * @var integer
     */
    public $acessos;

    /**
     * Licenças.
     * @var string
     */
    public $licencas;

    /**
     * Nomes de usuários
     * @var string
     */
    public $usuarios;

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
        return "`acesso`";
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
            $this->ultimo_acesso = $fetch_object->ultimo_acesso;
            $this->ultimo_endereco = $fetch_object->ultimo_endereco;
            $this->provedor = $fetch_object->provedor;
            $this->latlng = $fetch_object->latlng;
            $this->regiao = $fetch_object->regiao;
            $this->idioma = $fetch_object->idioma;
            $this->navegador = $fetch_object->navegador;
            $this->plataforma = $fetch_object->plataforma;
            $this->acessos = $fetch_object->acessos;
            $this->licencas = $fetch_object->licencas;
            $this->usuarios = $fetch_object->usuarios;
            return true;
        } catch (Exception $exception) {
            $this->id = null;
            $this->data_hora = null;
            $this->identificador = null;
            $this->ultimo_acesso = null;
            $this->ultimo_endereco = null;
            $this->provedor = null;
            $this->latlng = null;
            $this->regiao = null;
            $this->idioma = null;
            $this->navegador = null;
            $this->plataforma = null;
            $this->acessos = null;
            $this->licencas = null;
            $this->usuarios = null;
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
            $bd->ExecutarSQL("DROP TABLE `acesso`;");
        }
        if ($create) {
            $bd->ExecutarSQL("CREATE TABLE IF NOT EXISTS `acesso` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Código único',
  `data_hora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento da criação do registro',
  `identificador` varchar(30) NOT NULL COMMENT 'Identificador do acesso.',
  `acessos` integer NOT NULL COMMENT 'Acessos realizados.',
  `ultimo_acesso` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Último acesso',
  `ultimo_endereco` varchar(50) NOT NULL COMMENT 'Endereço de rede.',
  `regiao` varchar(100) COMMENT 'Região e país do cliente.',
  `provedor` varchar(500) COMMENT 'Provedor de internet.',
  `latlng` varchar(50) COMMENT 'Latitude e Longitude.',
  `idioma` varchar(10) COMMENT 'Idioma do usuário.',
  `navegador` varchar(100) COMMENT 'Navegador de internet.',
  `plataforma` varchar(100) COMMENT 'Sistema operacional.',
  `licencas` varchar(500) COMMENT 'Licenças utilizadas.',
  `usuarios` varchar(500) COMMENT 'Nomes de usuários utilizados.',
  `observacoes` varchar(500) COMMENT 'Observações adicionais.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_aces_id` (`id`),
  UNIQUE KEY `un_aces_identificador` (`identificador`),
  INDEX `in_aces_ultimo_endereco` (`ultimo_endereco`),
  INDEX `in_aces_provedor` (`provedor`),
  INDEX `in_aces_regiao` (`regiao`),
  INDEX `in_aces_idioma` (`idioma`),
  INDEX `in_aces_navegador` (`navegador`),
  INDEX `in_aces_plataforma` (`plataforma`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Lista de acessos ao script do robô.';");
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
            "SELECT `id` FROM `acesso` WHERE UPPER(TRIM(`identificador`)) = UPPER(TRIM(?)) LIMIT 2", false,
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
            "SELECT COUNT(`id`) FROM `acesso` WHERE `id` = ? or UPPER(TRIM(`identificador`)) = UPPER(TRIM(?))", false,
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
            "INSERT INTO `acesso` (`identificador`, `ultimo_acesso`, `ultimo_endereco`, `provedor`, `latlng`, `regiao`, `idioma`, `navegador`, `plataforma`, `licencas`, `usuarios`, `acessos`) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", true,
            "sssssssssssi", [ &$this->identificador, &$this->ultimo_acesso, &$this->ultimo_endereco, &$this->provedor, &$this->latlng, &$this->regiao, &$this->idioma, &$this->navegador, &$this->plataforma, &$this->licencas, &$this->usuarios, &$this->acessos ]);

        if (!$prepare->errno) {
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
                "UPDATE `acesso` set `identificador` = ?, `ultimo_acesso` = ?, `ultimo_endereco` = ?, `provedor` = ?, `latlng` = ?, `regiao` = ?, `idioma` = ?, `navegador` = ?, `plataforma` = ?, `licencas` = ?, `usuarios` = ?, `acessos` = ? WHERE `id` = ?", true,
                "sssssssssssii", [ &$this->identificador, &$this->ultimo_acesso, &$this->ultimo_endereco, &$this->provedor, &$this->latlng, &$this->regiao, &$this->idioma, &$this->navegador, &$this->plataforma, &$this->licencas, &$this->usuarios, &$this->acessos, &$this->id]);
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
                "DELETE FROM `acesso` WHERE `id` = ?", true,
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
        $sql .= $this->MontarCondicao($operador, "ultimo_acesso", $valores);
        $sql .= $this->MontarCondicao($operador, "ultimo_endereco", $valores);
        $sql .= $this->MontarCondicao($operador, "provedor", $valores);
        $sql .= $this->MontarCondicao($operador, "latlng", $valores);
        $sql .= $this->MontarCondicao($operador, "regiao", $valores);
        $sql .= $this->MontarCondicao($operador, "idioma", $valores);
        $sql .= $this->MontarCondicao($operador, "navegador", $valores);
        $sql .= $this->MontarCondicao($operador, "plataforma", $valores);
        $sql .= $this->MontarCondicao($operador, "licencas", $valores);
        $sql .= $this->MontarCondicao($operador, "usuarios", $valores);
        $sql .= $this->MontarCondicao($operador, "acessos", $valores);

        $sql = "SELECT " . ($count ? "COUNT(*) as total" : "*") . " FROM `acesso`" . (count($valores) ? " WHERE " : "") . rtrim($sql) . ($count ? "" : " ORDER BY $orderby LIMIT " . ($pagina * $quantidade) . ", $quantidade");
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
        if (preg_match('/\'un_aces_identificador\'/', $mensagem)) {
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
        $validacao = $this->ValidarObrigatorio($entidade, "ultimo_acesso");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarObrigatorio($entidade, "ultimo_endereco");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarObrigatorio($entidade, "acessos");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarTipo($entidade, "identificador", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "ultimo_acesso", "strtotime", "data e hora");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "ultimo_endereco", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "acessos", "is_numeric", "texto");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarMaxlength($entidade, "identificador", 30);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "ultimo_endereco", 50);
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
        $validacao = $this->ValidarMaxlength($entidade, "licencas", 500);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "usuarios", 500);
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
            "ultimo_acesso" => "último acesso",
            "ultimo_endereco" => "endereço de rede",
            "provedor" => "provedor de internet",
            "latlng" => "latitude e longitude",
            "regiao" => "região",
            "idioma" => "idioma",
            "navegador" => "navegador",
            "plataforma" => "sistema operacional",
            "licencas" => "licenças",
            "usuarios" => "usuários",
            "acessos" => "total de acessos"];

        return array_key_exists($campo, $nomes) ? $nomes[$campo] : $campo;
    }

}
?>
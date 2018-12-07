<?php
/**
 * Entidade de banco de dados: Licenças
 */
class EntidadeBdLicenca extends EntidadeBd {
    /**
     * Nome
     * @var string
     */
    public $nome;

    /**
     * Email
     * @var string
     */
    public $email;

    /**
     * Contas
     * @var string
     */
    public $contas;

    /**
     * Validade da licença
     * @var date
     */
    public $validade;

    /**
     * Licença permanente. Quando reiniciar a tela já entra a licença.
     * @var string
     */
    public $permanente;

    /**
     * Modulos
     * @var string
     */
    public $modulos;

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
        return "`licenca`";
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
            $this->nome = $fetch_object->nome;
            $this->email = $fetch_object->email;
            $this->contas = $fetch_object->contas;
            $this->validade = $fetch_object->validade;
            $this->permanente = $fetch_object->permanente;
            $this->modulos = $fetch_object->modulos;
            return true;
        } catch (Exception $exception) {
            $this->id = null;
            $this->data_hora = null;
            $this->nome = null;
            $this->email = null;
            $this->contas = null;
            $this->validade = null;
            $this->permanente = null;
            $this->modulos = null;
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
            $bd->ExecutarSQL("DROP TABLE `licenca`;");
        }
        if ($create) {
            $bd->ExecutarSQL("CREATE TABLE IF NOT EXISTS `licenca` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Código único',
  `data_hora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento da criação do registro',
  `nome` varchar(50) NOT NULL COMMENT 'Nome pessoal.',
  `email` varchar(50) NOT NULL COMMENT 'E-mail proprietário da licença.',
  `contas` varchar(500) COMMENT 'Contas Luckygames.io autorizadas.',
  `validade` timestamp NULL COMMENT 'Validade da licença.',
  `permanente` integer NOT NULL COMMENT 'Indica se a licença é permanente.',
  `modulos` varchar(100) COMMENT 'Módulos adquiridos.',
  `observacoes` varchar(500) COMMENT 'Observações adicionais.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_lice_id` (`id`),
  UNIQUE KEY `un_lice_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Licenças concedidas para módulos.';");
            
            self::CriarDadosIniciais($bd);
        }
    }

    /**
     * Cria os dados iniciais na tabela.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados.
     * @return void
     */
    public static function CriarDadosIniciais(BancoConexaoMySQL $bd = null) {
        if (count((new EntidadeBdLicenca($bd))->Listar()) === 0) {
            $padrao = [
                [
                    'nome' => 'Tips User',
                    'email' => 'luckygames.tips@luckygames.tips',
                    'contas' => '*',
                    'validade' => null,
                    'permanente' => 0,
                    'modulos' => 'Estatisticas Limites',
                    'observacoes' => 'Licença livre para uso gratuito.'
                ],
                [
                    'nome' => 'Sergio Cabral',
                    'email' => 'sergio@cabral.br.com',
                    'contas' => '',
                    'validade' => null,
                    'permanente' => 1,
                    'modulos' => 'Estatisticas Alertas Limites Espera Seed MartinBot MiddleBot CrazyBot Parametros Remoto',
                    'observacoes' => 'Minha licença pessoal.'
                ]
            ];
            foreach ($padrao as $licenca) {
                $entidade = new EntidadeBdLicenca($bd);
                foreach ($licenca as $prop => $val) {
                    $entidade->$prop = $val;
                }
                $entidade->Inserir($bd);
            }
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
            "SELECT `id` FROM `licenca` WHERE UPPER(TRIM(`email`)) = UPPER(TRIM(?)) LIMIT 2", false,
            "s", [ &$this->email]);
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
            "SELECT COUNT(`id`) FROM `licenca` WHERE `id` = ? or UPPER(TRIM(`email`)) = UPPER(TRIM(?))", false,
            "is", [ &$this->id, &$this->email]);

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
            "INSERT INTO `licenca` (`nome`, `email`, `contas`, `validade`, `permanente`, `modulos`) VALUE (?, ?, ?, ?, ?, ?)", true,
            "ssssis", [ &$this->nome, &$this->email, &$this->contas, &$this->validade, &$this->permanente, &$this->modulos ]);

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
                "UPDATE `licenca` set `nome` = ?, `email` = ?, `contas` = ?, `validade` = ?, `permanente` = ?, `modulos` = ? WHERE `id` = ?", true,
                "ssssisi", [ &$this->nome, &$this->email, &$this->contas, &$this->validade, &$this->permanente, &$this->modulos, &$this->id]);
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
                "DELETE FROM `licenca` WHERE `id` = ?", true,
                "i", [ &$this->id]);
        }

        return $prepare->errno ? $this->TratarMensagemDeErro($prepare->error) :
        $prepare->affected_rows == 0 ? $this->TratarMensagemDeErro("Esta licença não existe mais e não pode ser excluída.") :
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
        $sql .= $this->MontarCondicao($operador, "nome", $valores);
        $sql .= $this->MontarCondicao($operador, "email", $valores);
        $sql .= $this->MontarCondicao($operador, "contas", $valores);
        $sql .= $this->MontarCondicao($operador, "validade", $valores);
        $sql .= $this->MontarCondicao($operador, "permanente", $valores);
        $sql .= $this->MontarCondicao($operador, "modulos", $valores);

        $sql = "SELECT " . ($count ? "COUNT(*) as total" : "*") . " FROM `licenca`" . (count($valores) ? " WHERE " : "") . rtrim($sql) . ($count ? "" : " ORDER BY $orderby LIMIT " . ($pagina * $quantidade) . ", $quantidade");
        $entidades = [];

        $prepare = $bd->ExecutarSQL($sql, false, str_repeat("s", count($valores)), $valores);
        $result = $prepare->get_result();
        while ($fetch_object = $result->fetch_object()) {
            if ($count) {
                return $fetch_object->total;
            }

            $entidade = new EntidadeBdLicenca($bd);
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
        if (preg_match('/\'un_lice_email\'/', $mensagem)) {
            preg_match('/\'.*?\'/', $mensagem, $matches);
            $mensagem = sprintf("Já existe uma licença este email: %s", $matches[0]);
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

        $validacao = $this->ValidarObrigatorio($entidade, "nome");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarObrigatorio($entidade, "email");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarObrigatorio($entidade, "permanente");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarTipo($entidade, "nome", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "email", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "contas", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "validade", "strtotime", "data");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "permanente", "is_numeric", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "modulos", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarMaxlength($entidade, "nome", 50);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "email", 50);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "contas", 500);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "modulos", 100);
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
            "nome" => "nome",
            "email" => "e-mail",
            "contas" => "contas",
            "validade" => "validade",
            "permanente" => "licença permanente",
            "modulos" => "módulos"];

        return array_key_exists($campo, $nomes) ? $nomes[$campo] : $campo;
    }

}
?>
<?php
include 'plugins/JSMin/jsmin.php';

/**
 * Entidade de banco de dados: Link temporário para arquivos protegidos
 */
class EntidadeBdLink extends EntidadeBd {
    /**
     * Identificador.
     * @var string
     */
    public $identificador;

    /**
     * Arquivo real.
     * @var string
     */
    public $arquivo;

    /**
     * Link temporário de único acesso, ou não.
     * @var boolean
     */
    public $temporario;

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
        return "`link`";
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
            $this->arquivo = $fetch_object->arquivo;
            $this->temporario = $fetch_object->temporario;
            return true;
        } catch (Exception $exception) {
            $this->id = null;
            $this->data_hora = null;
            $this->identificador = null;
            $this->arquivo = null;
            $this->temporario = null;
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
            $bd->ExecutarSQL("DROP TABLE `link`;");
        }
        if ($create) {
            $bd->ExecutarSQL("CREATE TABLE IF NOT EXISTS `link` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Código único',
  `data_hora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Momento da criação do registro',
  `identificador` varchar(30) NOT NULL COMMENT 'Identificador para acesso ao arquivo.',
  `arquivo` varchar(500) NOT NULL COMMENT 'Endereço real do arquivo.',
  `temporario` INTEGER NOT NULL COMMENT 'Indica se o link é de um único acesso.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_link_id` (`id`),
  UNIQUE KEY `un_link_identificador` (`identificador`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Lista de acessos ao script do robô.';");
            
            self::CriarDadosIniciais($bd);
        }
    }

    /**
     * Cria os dados iniciais na tabela.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados.
     * @return void
     */
    public static function CriarDadosIniciais(BancoConexaoMySQL $bd = null) {
        if (count((new EntidadeBdLink($bd))->Listar()) === 0) {
            $padrao = [
                'script' => basename(dirname(__FILE__)) . '/scripts/tips.js',
            ];
            foreach ($padrao as $identificador => $arquivo) {
                $entidade = new EntidadeBdLink($bd);
                $entidade->identificador = $identificador;
                $entidade->arquivo = $arquivo;
                $entidade->temporario = 0;
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
            "SELECT `id` FROM `link` WHERE UPPER(TRIM(`identificador`)) = UPPER(TRIM(?)) LIMIT 2", false,
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
            "SELECT COUNT(`id`) FROM `link` WHERE `id` = ? or UPPER(TRIM(`identificador`)) = UPPER(TRIM(?))", false,
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
            "INSERT INTO `link` (`identificador`, `arquivo`, `temporario`) VALUE (?, ?, ?)", true,
            "ssi", [ &$this->identificador, &$this->arquivo, &$this->temporario ]);

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
                "UPDATE `link` set `identificador` = ?, `arquivo` = ?, `temporario` = ? WHERE `id` = ?", true,
                "ssii", [ &$this->identificador, &$this->arquivo, &$this->temporario, &$this->id]);
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
                "DELETE FROM `link` WHERE `id` = ?", true,
                "i", [ & $this->id]);
        }

        return $prepare->errno ? $this->TratarMensagemDeErro($prepare->error) :
        $prepare->affected_rows == 0 ? $this->TratarMensagemDeErro("Este link não existe mais e não pode ser excluído.") :
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
        $sql .= $this->MontarCondicao($operador, "arquivo", $valores);
        $sql .= $this->MontarCondicao($operador, "temporario", $valores);

        $sql = "SELECT " . ($count ? "COUNT(*) as total" : "*") . " FROM `link`" . (count($valores) ? " WHERE " : "") . rtrim($sql) . ($count ? "" : " ORDER BY $orderby LIMIT " . ($pagina * $quantidade) . ", $quantidade");
        $entidades = [];

        $prepare = $bd->ExecutarSQL($sql, false, str_repeat("s", count($valores)), $valores);
        $result = $prepare->get_result();
        while ($fetch_object = $result->fetch_object()) {
            if ($count) {
                return $fetch_object->total;
            }

            $entidade = new EntidadeBdLink($bd);
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
            $mensagem = sprintf("Já existe um link para este identificador: %s", $matches[0]);
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
        $validacao = $this->ValidarObrigatorio($entidade, "arquivo");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarObrigatorio($entidade, "temporario");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarTipo($entidade, "identificador", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "arquivo", "is_string", "texto");
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarTipo($entidade, "temporario", "is_numeric", "texto");
        if ($validacao !== null) { return $validacao; }

        $validacao = $this->ValidarMaxlength($entidade, "identificador", 30);
        if ($validacao !== null) { return $validacao; }
        $validacao = $this->ValidarMaxlength($entidade, "arquivo", 500);
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
            "temporario" => "temporario",
            "arquivo" => "arquivo"];

        return array_key_exists($campo, $nomes) ? $nomes[$campo] : $campo;
    }

    /** 
     * Cria um link temporário para o arquivo informado.
     * @param string $arquivo endereço real do arquivo no disco.
     * @param boolean $temporario Informa se o link deve ser excluído após ser acessado.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return string Identificador do link.
    */
    public function Criar($arquivo, $temporario = true, BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);
        $this->arquivo = $arquivo;
        if (file_exists($arquivo)) {
            $this->identificador = Util::ObterTextoUnico();
            $this->temporario = $temporario ? 1 : 0;
            $this->Inserir($bd);
        }
        else {
            $this->identificador = null;
        }
    }

    /**
     * Retorna o conteúdo de um link
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return string conteudo do arquivo
     */
    public function LerDados(BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);
        $lista = $this->Listar("AND", 0, 2, "`data_hora` DESC", false, $bd);
        if (count($lista) == 1 && $lista[0]->arquivo) {
            $entidade = $lista[0];

            if (Util::DebugAtivo()) {
                $conteudo = file_get_contents($entidade->arquivo);
            }
            else {
                $minify = true;
                if (strpos(strtolower($entidade->arquivo), '.js') !== false && strpos(strtolower($entidade->arquivo), '.min.js') === false) {
                    $arquivo = str_replace('.js', '.min.js', $entidade->arquivo);
                    if (file_exists($entidade->arquivo)) {
                        $entidade->arquivo = $arquivo;
                        $minify = false;
                    }
                }
                $conteudo = file_get_contents($entidade->arquivo);
                if ($minify) {
                    $conteudo = JSMin::minify($conteudo);
                }
            }

            if ($entidade->temporario) {
                $this->Excluir($bd);
            }
            return $conteudo;


        }
    }
}
?>
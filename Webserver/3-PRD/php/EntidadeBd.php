<?php
/**
 * Classe abstrata para todas as entidades de banco de dados.
 */
abstract class EntidadeBd extends EntidadeCm {
    /**
     * Identificado da entidade no banco de dados.
     * @var int
     */
    public $id;

    /**
     * Momento da criação do registro.
     * @var DateTime
     */
    public $data_hora;

    /**
     * Construtor
     * @param BancoConexaoMySQL $bd Instância do banco de dados (opcional).
     */
    public function __construct(BancoConexaoMySQL $bd = null) {
        $this->bd = $bd;
    }

    /**
     * Instância do banco de dados.
     * @var BancoConexaoMySQL
     */
    private $bd;

    /**
     * Define o valor da variável interna com a instância da classe de banco de dados.
     * @param BancoConexaoMySQL $bd Instância do banco de dados.
     */
    public function DefinirBancoDeDados($bd) {
        $this->bd = $bd;
    }

    /**
     * Verifica se uma instância de banco de dados está realmente correta.
     * @param BancoConexaoMySQL $bd Instância do banco de dados.
     * @return BancoConexaoMySQL Retorna a própria instancia passada
     */
    protected static function BancoDeDadosVerificado(BancoConexaoMySQL $bd = null) {
        if (!$bd || gettype($bd) !== "object" || get_class($bd) !== BancoConexaoMySQL::class) {
            UtilException::Disparar("Não foi definido a instância de conexão com o banco de dados do tipo BancoConexaoMySQL.", __FILE__, __LINE__);
        }
        return $bd;
    }

    /**
     * Retorna a instância para a classe de banco de dados.
     * Seja pelo argumento passado ou pela variável interna já defina pelo construtor.
     * @param BancoConexaoMySQL $bd Instância do banco de dados. (optional)
     * @return BancoConexaoMySQL
     */
    protected function BancoDeDados(BancoConexaoMySQL $bd = null) {
        $bd = $bd ? $bd : $this->bd;
        return self::BancoDeDadosVerificado($bd);
    }

    /**
     * Retorna uma string com parte da condição usada numa cláusula WHERE.
     * @param string $operador Operador aplicado antes da condição. (opcional)
     * @param string $propriedade Nome da propriedade desta entidade, passada como string.
     * @param array $valores Referência do array que armazena os valores que será passados como bind na consulta SQL.
     */
    protected function MontarCondicao($operador, $propriedade, &$valores) {
        $valor;
        eval('$valor = $this->' . $propriedade . ';');

        if ($valor !== null) {
            $comparador = strrpos($valor, "%") !== false ? "LIKE" : "=";
            $sql = "(UPPER(TRIM(`$propriedade`)) $comparador UPPER(TRIM(?))) ";
            if (count($valores) > 0) {
                $sql = "$operador $sql";
            }
            eval('$valores[] = &$this->' . $propriedade . ';');
            return $sql;
        }
    }

    /**
     * Verifica se a propriedade $this->id possui algum valor.
     * @param boolean $dispararException Quando true, dispara um erro como exception.
     * @return bool Retorna true se $this->id estiver preenchido.
     */
    protected function VerificarId($dispararException = true) {
        $result = (bool) $this->id;
        if (!$result && $dispararException) {
            UtilException::Disparar("Não é possível realizar esta operação com uma entidade sem Id.");
        }
        return $result;
    }

    /**
     * Insere ou altera esta entidade, dependendo se existe ou não no banco de dados.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    public function InserirOuAlterar(BancoConexaoMySQL $bd = null) {
        $this->CarregarId($bd);
        if ($this->Existe($bd)) {
            return $this->Alterar($bd);
        } else {
            return $this->Inserir($bd);
        }
    }

    /**
     * Retorna o nome da tabela da entidade
     * @return string
     */
    abstract public function NomeTabela();

    /**
     * Carrega as propriedades desta instância com base em um objeto recebido.
     * @param mixed $fetch_object Objeto com os dados
     * @return bool Quando todas as propriedades são definidas com sucesso retorna true.
     */
    abstract public function Carregar($fetch_object);

    /**
     * Executa comandos para DROP e CREATE da estrutura relacionada a esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados.
     * @param boolean $drop Quano true inclui os comandos DROP para eliminar a estrutura.
     * @param boolean $create Quano true inclui os comandos CREATE para criar a estrutura..
     * @return void
     */
    abstract public static function EstruturaDDL(BancoConexaoMySQL $bd, $drop = false, $create = true);

    /**
     * Tenta carregar o Id da entidade com base nos campos preendhidos.
     * Mas se o Id já estiver definido, sempre retornará true.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    abstract public function CarregarId(BancoConexaoMySQL $bd = null);

    /**
     * Verifica se uma entidade existe.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    abstract public function Existe(BancoConexaoMySQL $bd = null);

    /**
     * Insere esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    abstract public function Inserir(BancoConexaoMySQL $bd = null);

    /**
     * Altera esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    abstract public function Alterar(BancoConexaoMySQL $bd = null);

    /**
     * Exclui esta entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return bool Retorna true em caso de sucesso.
     */
    abstract public function Excluir(BancoConexaoMySQL $bd = null);

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
    abstract public function Listar($operador = "AND", $pagina = 0, $quantidade = 10, $orderby = "1 ASC", $count = false, BancoConexaoMySQL $bd = null);

    /**
     * Retorna o total de entidades no banco de dados.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @return integer Retorna o total de linhas.
     */
    public function Contagem(BancoConexaoMySQL $bd = null) {
        $bd = $this->BancoDeDados($bd);

        $sql = "SELECT COUNT(*) AS total FROM " . $this->NomeTabela();

        $prepare = $bd->ExecutarSQL($sql, false);
        $result = $prepare->get_result();
        while ($fetch_object = $result->fetch_object()) {
            return $fetch_object->total;
        }

        return;
    }

    /**
     * Torna uma mensagem de erro amigável ao usuário.
     * @param string $mensagem Mensagem de erro.
     * @return string Mensagem tratada.
     */
    public function TratarMensagemDeErro($mensagem) {
        if (preg_match('/\bnull\b/', $mensagem)) {
            preg_match('/\'.*?\'/', $mensagem, $matches);
            $mensagem = sprintf("O campo %s deve ter um valor informado.", $this->NomeDescritivoDoCampo($matches[0]));
        } else {
            $mensagem = $this->TratarMensagemDeErroCustomizado($mensagem);
        }
        return $mensagem;
    }

    /**
     * Validação de tipo de campo de entidade.
     * @param EntidadeBd $entidade Instância da entidade.
     * @param string $campo Nome do campo a ser validado.
     * @param integer $funcaoDeVerificacao Nome da função que retorna true caso a verificação do tipo passe.
     * @param string $descricaoDoTipo Descrição amigável ao usuário do tipo esperado.
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    public function ValidarTipo($entidade, $campo, $funcaoDeVerificacao, $descricaoDoTipo) {
        $sucesso;
        eval('$sucesso = $entidade->' . $campo . ' === null || ' . $funcaoDeVerificacao . '($entidade->' . $campo . ');');
        if (!$sucesso) {
            return sprintf("O campo %s deve receber um valor de tipo %s.", $this->NomeDescritivoDoCampo($campo), $descricaoDoTipo);
        }
        return null;
    }

    /**
     * Validação de maxlength de campo de entidade.
     * @param EntidadeBd $entidade Instância da entidade.
     * @param string $campo Nome do campo a ser validado.
     * @param integer $maxlength Valor máximo do comprimento do campo.
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    public function ValidarMaxlength($entidade, $campo, $maxlength) {
        $valor;
        eval('$valor = $entidade->' . $campo . ';');
        if ($valor !== null && strlen((string)$valor) > $maxlength) {
            return sprintf("O campo %s deve ter no máximo %d caracteres.", $this->NomeDescritivoDoCampo($campo), $maxlength);
        }
        return null;
    }

    /**
     * Validação de maxlength de campo array de entidade.
     * @param EntidadeBd $entidade Instância da entidade.
     * @param string $campo Nome do campo a ser validado.
     * @param integer $maxlength Valor máximo do comprimento do campo.
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    public function ValidarMaxlengthArray($entidade, $campo, $maxlength) {
        $valor;
        eval('$valor = $entidade->' . $campo . ';');
        if ($valor !== null && count($valor) > $maxlength) {
            return sprintf("O campo %s deve ter no máximo %d posições.", $this->NomeDescritivoDoCampo($campo), $maxlength);
        }
        return null;
    }

    /**
     * Validação de endereço de e-mail.
     * @param EntidadeBd $entidade Instância da entidade.
     * @param string $campo Nome do campo a ser validado.
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    public function ValidarEmail($entidade, $campo) {
        $valor;
        eval('$valor = $entidade->' . $campo . ';');
        if ($valor !== null && !filter_var($valor, FILTER_VALIDATE_EMAIL)) {
            return sprintf("O campo %s deve receber um endereço de e-mail válido.", $this->NomeDescritivoDoCampo($campo));
        }
        return null;
    }

    /**
     * Validação de número de CPF
     * @param EntidadeBd $entidade Instância da entidade.
     * @param string $campo Nome do campo a ser validado.
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    public function ValidarCpf($entidade, $campo) {
        $valor;
        eval('$valor = $entidade->' . $campo . ';');
        if ($valor !== null && !UtilString::ValidaCPF($valor)) {
            return sprintf("O campo %s deve receber um número válido.", $this->NomeDescritivoDoCampo($campo));
        }
        return null;
    }

    /**
     * Validação de campo obrigatório de entidade.
     * @param EntidadeBd $entidade Instância da entidade.
     * @param string $campo Nome do campo a ser validado.
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    public function ValidarObrigatorio($entidade, $campo) {
        $valor;
        eval('$valor = $entidade->' . $campo . ';');
        if (!strlen(trim($valor))) {
            return sprintf("O campo %s deve receber um valor.", $this->NomeDescritivoDoCampo($campo));
        }
        return null;
    }

    /**
     * Torna uma mensagem de erro amigável ao usuário.
     * Tratamento customizado.
     * @param string $mensagem Mensagem de erro.
     * @return string Mensagem tratada.
     */
    abstract public function TratarMensagemDeErroCustomizado($mensagem);

    /**
     * Valida os campos de uma entidade.
     * @param BancoConexaoMySQL $bd Instância da classe que gerencia o banco de dados. (opcional se já passado no construtor)
     * @param mixed $entidade Entidade. (Opcional. Senão informado assume esta entidade);
     * @return null|string Se não for válido retorna a mensagem de erro. Quando válido retorna null.
     */
    abstract public function ValidarEntidade(BancoConexaoMySQL $bd = null, $entidade = null);

    /**
     * Retorna o nome descritivo de um campo desta entidade.
     * @param string $campo Nome do campo
     * @return string Nome descritivo do campo
     */
    abstract public static function NomeDescritivoDoCampo($campo);
}
?>
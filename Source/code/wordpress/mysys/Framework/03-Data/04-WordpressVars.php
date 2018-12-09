<?php
namespace Mysys\Data;

/**
 * Registra itens tipo DEFINE e variáveis globais para uso do Wordpress.
 */
class WordpressVars extends LoadData {

    /**
     * @return WordpressVars
     */
    public static function instance () { return parent::instance(); }

    /**
     * Realiza as atividads desta classe na inicialização do Mysys.
     */
    public function init() {
        $this->SetGlobalVars();
        $this->DefineDatabase();
        $this->DefineSalts();
        $this->defineDebug();
        $this->defineSiteUrl();
    }

    /**
     * Informações de conexão com o banco de dados.
     */
    public function GetDatabaseInfo() {
        $env = Environment::instance()->name();
        return $this->data['database'][$env];
    }

    /**
     * Prefixo da tabela.
     * @return string
     */
    public function GetTablePrefix() {
        global $table_prefix;
        if (empty($table_prefix)) {
            return $this->data['globals']['table_prefix'];
        } else {
            return $table_prefix;
        }
    }

    /**
     * Define variáveis globais.
     */
    public function SetGlobalVars() {
        foreach ($this->data['globals'] as $key => $value) {
            eval("global \$$key; \$$key = \$value;");
        }
    }

    /**
     * Dados de conexão com banco de dados.
     */
    public function DefineDatabase() {
        foreach ($this->GetDatabaseInfo() as $key => $value) {
            $this->define($key, $value);
        }
    }

    /**
     * Salts e Keys usadas em criptografia.
     */
    public function DefineSalts() {
        $needGenerateSalts = false;
        foreach ($this->data['salts'] as $key => $value) {
            if (empty($value)) {
                $value = $this->unique(65, null, 'str_shuffle(?)', '');
                $this->data['salts'][$key] = $value;
                $needGenerateSalts = true;
            }
            $this->define($key, $value);
        }

        if ($needGenerateSalts) {
            $json = json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $json = mb_convert_encoding($json, mb_detect_encoding($this->text, 'UTF-8, ISO-8859-1', true));

            \Mysys\Core\Cache::instance()->File($this->getFilenameWithData(), $json);
        }
    }

    /**
     * Ativação de debug para o site.
     */
    public function defineDebug() {
        $this->define('WP_DEBUG', Environment::instance()->isDebug() ? true : false);

        $this->define('WP_DEBUG_LOG', WP_DEBUG);
        $this->define('WP_DEBUG_DISPLAY', WP_DEBUG);
        $this->define('SCRIPT_DEBUG', WP_DEBUG);
        $this->define('STYLE_DEBUG', WP_DEBUG);
        $this->define('QM_ENABLE_CAPS_PANEL', WP_DEBUG);
        
        if (WP_DEBUG) {
            error_reporting(E_ALL);
            @ini_set('display_errors', 1);
        }
        else {
            @ini_set('display_errors', 0);
        }
    }

    /**
     * Define a url do website se for ambiente de debug.
     */
    public function defineSiteUrl() {
        if (Environment::instance()->isDebug()) {
            $url =
                (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") .
                "://{$_SERVER['HTTP_HOST']}";

            $this->define('WP_HOME', $url);
            $this->define('WP_SITEURL', $url);
        }
    }
}

<?php
namespace Mysys\Framework\Data;

/**
 * Aplicação do plugin Mysys no Wordpress.
 */
class MysysPlugin extends LoadData {

    /**
     * @return MysysPlugin
     */
    public static function instance () { return parent::instance(); }

    /**
     * Realiza as atividads desta classe na inicialização do Mysys.
     */
    public function init() {
        $this->InstallPlugin();
    }

    /**
     * Indica se o plugin acabou de ser instalado neste request.
     * @var boolean
     */
    private $_isInstalledNow = false;

    /**
     * Indica se o plugin acabou de ser instalado neste request.
     * @return boolean
     */
    public function isInstalledNow() {
        return $this->_isInstalledNow;
    }

    /**
     * Retorna o nome do arquivo do plugin.
     * @return string
     */
    public function GetPluginFilename() {
        return $this->data['file'];
    }

    /**
     * Instala o plugin no Wordpress caso não exista.
     * @param boolean $force Quando TRUE força a criação do plugin.
     */
    public function InstallPlugin($force = false) {
        $path = implode(DIRECTORY_SEPARATOR, [
            dirname(dirname(dirname(dirname(__FILE__)))),
            'wp-content',
            'plugins',
            $this->GetPluginFilename(),
        ]);

        if ($force || !file_exists($path)) {
            $this->_isInstalledNow = true;
            if (false === @file_put_contents($path, $this->GetPluginContent())) {
                $this->error('Error when install plugin.', self::class);
            }
            $this->activatePlugin();
        }
    }

    /**
     * Ativa o plugin no Wordpress.
     */
    public function activatePlugin() {
        $database = WordpressVars::instance()->GetDatabaseInfo();
        $plugin = $this->GetPluginFilename();
        $prefix = WordpressVars::instance()->GetTablePrefix();

        $conn = mysqli_connect($database['DB_HOST'], $database['DB_USER'], $database['DB_PASSWORD'], $database['DB_NAME']);
        $query = $conn->query("SELECT `option_value` FROM {$prefix}options WHERE `option_name` = 'active_plugins'");
        $active_plugins = unserialize($query->fetch_object()->option_value);

        if (!in_array($plugin, $active_plugins)) {
            $active_plugins[] = $plugin;
            sort($active_plugins);
            $active_plugins = serialize($active_plugins);

            $conn->query("UPDATE {$prefix}options SET `option_value` = '{$active_plugins}' WHERE `option_name` = 'active_plugins'");
        }
        mysqli_close($conn);
    }

    /**
     * Retorna o conteúdo do arquivo do plugin.
     * @return string
     */
    private function GetPluginContent() {
        $content = '';

        $content .= "<?php" . PHP_EOL;
        $content .= "/*" . PHP_EOL;
        foreach ($this->data as $key => $value) {
            $content .= "$key: $value" . PHP_EOL;
        }
        $content .= "*/" . PHP_EOL;
        $content .= '\\' . \Mysys\Framework\Data\Wordpress::class . '::instance()->isLoaded(true);';

        $content = mb_convert_encoding($content, 'UTF-8');

        return $content;
    }
}
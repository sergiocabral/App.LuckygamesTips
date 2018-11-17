<?php
namespace Mysys\Data;

/**
 * Registra itens tipo DEFINE para uso do Wordpress.
 */
class WordpressConfigure extends LoadData {

    /**
     * @return WordpressConfigure
     */
    public static function Instance () { return parent::Instance(); }

    /**
     * Realiza as atividads desta classe na inicialização do Mysys.
     */
    public function Init() {
        $this->SetDefaultsIfNecessary();
    }

    /**
     * Aplica as configurações padrão se necessário.
     */
    public function SetDefaultsIfNecessary() {
        \Mysys\Core\Event::Instance()->Bind('OnWordpressLoaded', function() {
            add_action('activate_' . MysysPlugin::Instance()->GetPluginFilename(), array($this, 'SetDefaults'));
        });

        \Mysys\Core\Event::Instance()->Bind('OnWordpressHookStarted', function() {
            if (MysysPlugin::Instance()->IsInstalledNow()) {
                $this->SetDefaults();
            }
        });
    }

    /**
     * Aplica as configurações padrão.
     */
    public function SetDefaults() {
        require_once(ABSPATH . 'wp-admin/includes/admin.php');

        $this->RemoveUnnecessary();
        $this->AdjustFirstUser();
        $this->DeleteInitialData();
        $this->SetBlogOptions();
        $this->CreatePosts(true);
        $this->CreateMenu(true);

        \Mysys\Core\Event::Instance()->Trigger('OnMysysSetDefaults');
    }

    /**
     * Remove arquivos desnecessários do Wordpress: plugins, temas, etc.
     * @return void
     */
    public function RemoveUnnecessary() {
        if (isset($this->data['deactivate_plugins'])) {
            deactivate_plugins($this->data['deactivate_plugins']);
        }

        if (isset($this->data['delete_from_disk'])) {
            foreach ($this->data['delete_from_disk'] as $fileOrDir) {
                $this->DeleteFileOrDir(ABSPATH . DIRECTORY_SEPARATOR . $fileOrDir);
            }
        }
    }

    /**
     * Define propriedades padrão do usuário inicial (administrador).
     */
    public function AdjustFirstUser() {
        if (!isset($this->data['first_user'])) {
            return;
        }

        $user = get_userdata(1);

        if (!empty($user)) {
            $user = $user->data;
            if (isset($this->data['first_user']['user_meta'] )) {
                foreach ($this->data['first_user']['user_meta'] as $key => $value) {
                    update_user_meta($user->ID, $key, $value);
                }
            }

            foreach ($this->data['first_user'] as $key => $value) {
                if (is_string($value)) {
                    $user->$key = $value;
                }
            }

            $user->user_login = strtoupper($user->user_login);
            $user->user_nicename = strtolower($user->user_login);

            global $wpdb;
            $wpdb->update("{$wpdb->prefix}users", (array)$user, array('ID' => $user->ID));

            wp_cache_delete($user->ID, 'users');
        }
    }

    /**
     * Apaga os dados iniciais de exemplo.
     */
    public function DeleteInitialData() {
        $post = get_post(1);
        if (!empty($post)) {
            global $wpdb;

            $postIDs = implode(',', $wpdb->get_col("SELECT `id` FROM `{$wpdb->prefix}posts` WHERE `post_date` <= '{$post->post_date}'"));

            $wpdb->get_results("DELETE FROM `{$wpdb->prefix}posts` WHERE `post_date` <= '{$post->post_date}'");
            $wpdb->get_results("DELETE FROM `{$wpdb->prefix}comments` WHERE `comment_post_ID` in ($postIDs)");
            $wpdb->get_results("DELETE FROM `{$wpdb->prefix}postmeta` WHERE `post_ID` in ($postIDs)");
        }

        $sidebars_widgets = get_option('sidebars_widgets');

        foreach ($sidebars_widgets as $key => $value) {
            if (!is_array($value)) {
                continue;
            }

            foreach ($value as $widget_id) {
                $pieces = explode('-', $widget_id);
                $multi_number = array_pop($pieces);
                $id_base = implode('-', $pieces);
                $widget = get_option('widget_' . $id_base);
                unset($widget[$multi_number]);

                update_option('widget_' . $id_base, $widget);
            }

            $sidebars_widgets[$key] = array();
        }

        update_option('sidebars_widgets', $sidebars_widgets);
    }

    /**
     * Define os parâmetros padrão do site.
     */
    public function SetBlogOptions() {
        if (isset($this->data['options'])) {
            foreach ($this->data['options'] as $key => $value) {
                update_option($key, $value);
            }
        }

        if (isset($this->data['first_category'])) {
            wp_update_term(1, 'category', $this->data['first_category']);
        }
    }

    /**
     * Cria os itens de menu
     * @param integer $menuId
     * @param array $items
     * @param int $menuIdParent
     */
    private function CreateMenuItems($menuId, $items, $menuIdParent = null) {
        if (is_array($items)) {
            foreach ($items as $item) {
                $item['menu-item-parent-id'] = $menuIdParent;
                $item['menu-item-status'] = isset($item['menu-item-status']) ? $item['menu-item-status'] : 'publish';

                $newMenuId = wp_update_nav_menu_item($menuId, 0, $item);

                $this->CreateMenuItems($menuId, isset($item['_submenus']) ? $item['_submenus'] : null, $newMenuId);
            }
        }
    }

    /**
     * Cria os itens de menu padrão.
     * @param mixed $deleteIfExists Opcional.
     */
    public function CreateMenu($deleteIfExists = false) {
        if (!isset($this->data['main_menu'])) {
            return;
        }

        $menuName = 'Main Menu';
        $menu = wp_get_nav_menu_object($menuName);

        if (empty($menu)) {
            $menuId = wp_create_nav_menu($menuName);

            $theme = 'twentyseventeen';
            $theme_mods = get_option("theme_mods_$theme");
            $theme_mods['nav_menu_locations']['top'] = $menuId;
            update_option("theme_mods_$theme", $theme_mods);
        } else {
            if (!$deleteIfExists) {
                return;
            }

            $menuId = $menu->term_id;

            foreach (wp_get_nav_menu_items($menuId) as $menuItem) {
                wp_delete_post($menuItem->ID, true);
            }
        }

        $this->CreateMenuItems($menuId, $this->data['main_menu']);
    }

    /**
     * Cria os posts e pages padrão.
     * @param mixed $deleteIfExists Opcional.
     */
    public function CreatePosts($deleteIfExists = false) {
        if (!isset($this->data['posts'])) {
            return;
        }

        global $wpdb;

        foreach ($this->data['posts'] as $post) {
            $exists = $wpdb->get_var("SELECT COUNT(*) FROM `{$wpdb->prefix}posts` WHERE `post_name` = '{$post['post_name']}'");
            if ($exists && !$deleteIfExists) {
                continue;
            }

            $wpdb->delete("{$wpdb->prefix}posts", array('post_name' => $post['post_name']));

            $post['post_status'] = isset($post['post_status']) ? $post['post_status'] : 'publish';
            $post['post_content'] = isset($post['post_content']) ? $post['post_content'] : \Mysys\Website\Includes::Instance()->GetPostTemplate($post['post_name']);

            $postId = wp_insert_post($post);

            if (isset($post['_frontpage']) && $post['_frontpage']) {
                update_option('show_on_front', 'page');
                update_option('page_on_front', $postId);
            }
        }
    }
}
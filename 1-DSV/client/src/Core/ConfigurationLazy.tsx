namespace Core {

    /**
     * Conjunto de propriedades que configuram o sistema.
     * Porém são carregadas tardiamente via requisição ao servidor.
     */
    export type ConfigurationLazy = {

        /**
         * Tema para customização de cores do layout.
         */
        colors: Layout.Theme.Colors

        /**
         * Traduções do sistema.
         */
        translates: Locale.Translate[],
        
        /**
         * Informações de localização e região.
         */
        locale: Locale.FormatSet
    }
}
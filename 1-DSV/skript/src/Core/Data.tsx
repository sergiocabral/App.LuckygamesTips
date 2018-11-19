namespace Skript.Core {

    /**
     * Conjunto de dados que configuram o sistema.
     */
    export type Data = {

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
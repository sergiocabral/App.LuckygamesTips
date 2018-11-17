namespace Locale {

    /**
     * Unidade de tradução. Texto original e tradução.
     */
    export type Translate = { 

        /**
         * Idioma.
         * @type {string}
         */
        language: string, 

        /**
         * Identificador.
         * @type {string}
         */
        id: string,

        /**
         * Tradução.
         * @type {string}
         */
        translated: string
    }
}
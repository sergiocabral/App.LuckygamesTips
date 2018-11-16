namespace Core.Translate {

    /**
     * Frase em um determinado idioma
     */
    export type Phrase = { 

        /**
         * Texto.
         * @type {string}
         */
        text: string

        /**
         * Idioma.
         * @type {string}
         */
        language: string, 
    }
}
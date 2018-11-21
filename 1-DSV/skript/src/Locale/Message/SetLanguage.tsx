namespace Skript.Locale.Message {

    /**
     * Define o idioma padrão do sistema.
     */
    export class SetLanguage extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {string} language Idioma.
        */
        public constructor(language: string) {
            super();
            this.language = language;
        }

        /**
         * Idioma.
         * @type {string}
         */
        public language: string;
    }
}
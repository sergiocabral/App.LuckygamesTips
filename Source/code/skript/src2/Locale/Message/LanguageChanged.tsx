namespace Skript.Locale.Message {

    /**
     * Quando o idioma é alterado.
     */
    export class LanguageChanged extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {string} oldLanguage Antigo idioma.
         * @param {string} newLanguage Idioma definido.
         */
        public constructor(oldLanguage: string, newLanguage: string) {
            super();

            this.oldLanguage = oldLanguage;
            this.newLanguage = newLanguage;
        }

        /**
         * Antigo idioma.
         * @type {string}
         */
        public oldLanguage: string;

        /**
         * Idioma definido.
         * @type {string}
         */
        public newLanguage: string;        

    }
}
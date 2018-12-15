namespace Skript.Framework.Messages {

    /**
     * Idioma do sistema foi definido.
     */
    export class DidLanguageSetted extends Bus.Message { 

        /**
         * Construtor.
         * @param {string} oldLanguage Idioma anterior.
         * @param {string} newLanguage Novo idioma.
         */
        public constructor(public oldLanguage: string, public newLanguage: string) {
            super();
        }
    }
}
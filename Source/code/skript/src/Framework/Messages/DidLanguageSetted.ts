namespace Skript.Framework.Messages {

    /**
     * Idioma do sistema foi definido.
     */
    export class DidLanguageSetted extends Bus.Message { 

        /**
         * Construtor.
         * @param {string} language Idioma
         */
        public constructor(public language: string) {
            super();
        }
    }
}
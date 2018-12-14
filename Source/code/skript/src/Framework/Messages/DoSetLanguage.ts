namespace Skript.Framework.Messages {

    /**
     * Define o idioma do sistema.
     */
    export class DoSetLanguage extends Bus.Message { 

        /**
         * Construtor.
         * @param {string} language Idioma
         */
        public constructor(public language: string) {
            super();
        }
    }
}
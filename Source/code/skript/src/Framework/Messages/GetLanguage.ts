namespace Skript.Framework.Messages {

    /**
     * Idioma do sistema foi definido.
     */
    export class GetLanguage extends Bus.Message {

        /**
         * Idioma.
         * @type {string}
         */
        public language?: string;
    }
}
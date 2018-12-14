namespace Skript.Framework.Errors {

    /**
     * Esperado valor, mas constava undefined.
     */
    export class EmptyValue extends Base {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(message?: string, public innerError?: Error) {
            super("Empty not expected", message, innerError);
        }
    }
}
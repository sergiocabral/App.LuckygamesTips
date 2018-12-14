namespace Skript.Framework.Errors {

    /**
     * Dados inválidos.
     */
    export class InvalidData extends Base {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(message?: string, public innerError?: Error) {
            super("Invalid data", message, innerError);
        }
    }
}
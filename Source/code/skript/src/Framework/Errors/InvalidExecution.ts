namespace Skript.Framework.Errors {

    /**
     * Execução inválida.
     */
    export class InvalidExecution extends Base {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(message?: string, public innerError?: Error) {
            super("Invalid execution", message, innerError);
        }
    }
}
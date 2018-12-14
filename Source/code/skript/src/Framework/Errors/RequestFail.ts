namespace Skript.Framework.Errors {

    /**
     * Falha em requisição na internet.
     */
    export class RequestFail extends Base {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(message?: string, public innerError?: Error) {
            super("Request fail", message, innerError);
        }
    }
}
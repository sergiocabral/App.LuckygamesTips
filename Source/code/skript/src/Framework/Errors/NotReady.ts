namespace Skript.Framework.Errors {

    /**
     * Não estava pronto.
     */
    export class NotReady extends Framework.Errors.Base {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(message?: string, public innerError?: Error) {
            super("Not ready", message, innerError);
        }
    }
}
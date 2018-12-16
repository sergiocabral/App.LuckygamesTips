namespace Skript.Framework.Errors {

    /**
     * React não estava pronto.
     */
    export class ReactNotReady extends Framework.Errors.Base {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(message?: string, public innerError?: Error) {
            super("React not ready", message, innerError);
        }
    }
}
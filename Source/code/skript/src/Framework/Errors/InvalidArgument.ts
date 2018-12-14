namespace Skript.Framework.Errors {

    /**
     * Argumento inválido.
     */
    export class InvalidArgument extends Base {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(message?: string, public innerError?: Error) {
            super("Invalid argument", message, innerError);
        }
    }
}
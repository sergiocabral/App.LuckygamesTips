namespace Skript.Core.Errors {

    /**
     * Argumento inválido.
     */
    export class InvalidData extends ErrorBase {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         */
        public constructor(message?: string) {
            super("Invalid data", message);
        }

    }

}
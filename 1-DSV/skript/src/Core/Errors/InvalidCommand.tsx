namespace Skript.Core.Errors {

    /**
     * Execução ou comando inválido.
     */
    export class InvalidCommand extends ErrorBase {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         */
        public constructor(message?: string) {
            super("Invalid command", message);
        }

    }

}
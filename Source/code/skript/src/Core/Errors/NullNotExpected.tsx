namespace Skript.Core.Errors {

    /**
     * Valor null não esperado.
     */
    export class NullNotExpected extends ErrorBase {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         */
        public constructor(message?: string) {
            super("Null value not expected", message);
        }

    }

}
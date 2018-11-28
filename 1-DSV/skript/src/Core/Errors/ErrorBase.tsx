namespace Skript.Core.Errors {

    /**
     * Classe base para todos os Errors do sistema.
     */
    export abstract class ErrorBase extends Error {

        /**
         * Construtor.
         * @param {string} error Descrição do erro.
         * @param {string} message Mensagem complementar do programador.
         */
        public constructor(error: string, message?: string) {
            super(error + (message ? ": " + message : "."));
        }

    }

}
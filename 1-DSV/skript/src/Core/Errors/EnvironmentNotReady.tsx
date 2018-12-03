namespace Skript.Core.Errors {

    /**
     * Ambiente não está pronto para a ação solicitada.
     */
    export class EnvironmentNotReady extends ErrorBase {

        /**
         * Construtor.
         * @param {string} message Opcional. Mensagem complementar.
         */
        public constructor(message?: string) {
            super("Environment not ready", message);
        }

    }

}
namespace Skript.Business.Messages {

    /**
     * Aplica definições de automação dos módulos.
     */
    export class DoAutomationApply extends Framework.Bus.Message {

        /**
         * Construtor.
         * @param {Object} settings Definições.
         * @param {boolean} verbose Opcional. Quando false não emite mensagens.
         */
        public constructor(public settings: any, public verbose: boolean = true) {
            super();
        }

        /**
         * Sucessos ao aplicar as definições.
         */
        public success?: string[];

        /**
         * Erros ao aplicar as definições.
         */
        public errors?: string[];
    }
}
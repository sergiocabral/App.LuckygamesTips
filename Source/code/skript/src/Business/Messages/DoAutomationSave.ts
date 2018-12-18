namespace Skript.Business.Messages {

    /**
     * Grava definições em um conjunto de automação.
     */
    export class DoAutomationSave extends Framework.Bus.Message {

        /**
         * Construtor.
         * @param {string} name Definições.
         * @param {Object} settings Definições.
         * @param {boolean} verbose Opcional. Quando false não emite mensagens.
         */
        public constructor(public name: string, public settings: any, public verbose: boolean = true) {
            super();
        }

        /**
         * Indica que foi criado um novo.
         */
        public created?: boolean;

        /**
         * Indica que foi editado um existente.
         */
        public edited?: boolean;
    }
}
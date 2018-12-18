namespace Skript.Business.Messages {

    /**
     * Apaga um conjunto de automação.
     */
    export class DoAutomationDelete extends Framework.Bus.Message {

        /**
         * Construtor.
         * @param {string} name Nome.
         * @param {boolean} verbose Opcional. Quando false não emite mensagens.
         */
        public constructor(public name: string, public verbose: boolean = true) {
            super();
        }

        /**
         * Indica que foi apagado
         */
        public deleted?: boolean;
    }
}
namespace Skript.Business.Messages {

    /**
     * Após gravar definições em um conjunto de automação.
     */
    export class DidAutomationUpdated extends Framework.Bus.Message {
        
        /**
         * Constructor.
         * @param {string} name Nome do conjunto de automação atualizado.
         * @param {boolean} created Criado.
         * @param {boolean} edited Editado.
         * @param {boolean} deleted Apagado.
         */
        public constructor(
            public name: string, 
            public created: boolean, 
            public edited: boolean, 
            public deleted: boolean) { 
            super();
        }
    }
}
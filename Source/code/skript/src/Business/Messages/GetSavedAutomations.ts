namespace Skript.Business.Messages {

    /**
     * Retorna a lista de automações gravadas.
     */
    export class GetSavedAutomations extends Framework.Bus.Message {

        /**
         * Lista de automações.
         * @type {Framework.Types.Index<Object>}
         */
        public automations?: Framework.Types.Index<Object>;
    }
}
namespace Skript.Business.Messages {

    /**
     * Retorna a lista de automações.
     */
    export class GetAutomations extends Framework.Bus.Message {

        /**
         * Lista de automações.
         * @type {Framework.Types.Index<Types.Automation>}
         */
        public automations?: Framework.Types.Index<Automation.Set>;
    }
}
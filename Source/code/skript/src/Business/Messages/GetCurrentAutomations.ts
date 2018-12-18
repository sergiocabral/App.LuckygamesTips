namespace Skript.Business.Messages {

    /**
     * Retorna a lista de automações atual dos módulos..
     */
    export class GetCurrentAutomations extends Framework.Bus.Message {

        /**
         * Lista de automações.
         * @type {Framework.Types.Index<Types.Automation>}
         */
        public automations?: Framework.Types.Index<Automation.Set>;
    }
}
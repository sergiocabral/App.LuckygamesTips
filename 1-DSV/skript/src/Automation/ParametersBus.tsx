namespace Skript.Automation {

    /**
     * Despachador de mensagens.
     */
    export class ParametersBus extends Core.Bus.MessageBus<typeof Parameters> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Message.GetCurrentParameters.name,
                handler: (command: Message.GetCurrentParameters) => command.result = { parameters: this.sponsor.parameters() }
            }
        ];
    }    
}

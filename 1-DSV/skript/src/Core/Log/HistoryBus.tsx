namespace Skript.Core.Log {

    /**
     * Manipula e registra mensagens de log.
     */
    export class HistoryBus extends Core.Bus.MessageBus<History> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Core.Message.GetLogMessages.name,
                handler: (command: Core.Message.GetLogMessages) => {
                    command.messages = this.sponsor.messages();
                }
            }
        ];
    }
}
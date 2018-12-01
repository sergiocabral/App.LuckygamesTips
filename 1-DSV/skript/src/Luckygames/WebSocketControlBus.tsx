namespace Skript.Luckygames {

    /**
     * Despachador de mensagens.
     */
    export class WebSocketControlBus extends Core.Bus.MessageBus<typeof WebSocketControl> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Message.SetWebSocketMode.name,
                handler: (command: Message.SetWebSocketMode) => command.result = { mode: this.sponsor.mode(command.mode) }
            },
            {                
                message: Message.GetWebSocketMode.name,
                handler: (command: Message.GetWebSocketMode) => command.result = { mode: this.sponsor.mode() }
            }
        ];
    }    
}

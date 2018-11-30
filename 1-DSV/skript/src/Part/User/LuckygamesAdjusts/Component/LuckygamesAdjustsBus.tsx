namespace Skript.Part.User.LuckygamesAdjusts.Component {

    /**
     * Despachador de mensagens.
     */
    export class LuckygamesAdjustsBus extends Core.Bus.MessageBus<LuckygamesAdjusts> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Luckygames.Message.WebSocketModeWasChanged.name,
                handler: (command: Luckygames.Message.WebSocketModeWasChanged) => this.sponsor.setOptionWebsocket(command.mode)
            }
        ];
    }    
}

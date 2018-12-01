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
            },
            {                
                message: Luckygames.Message.AnimationModeWasChanged.name,
                handler: (command: Luckygames.Message.AnimationModeWasChanged) => this.sponsor.setOptionAnimation(command.mode)
            },
            {                
                message: Luckygames.Message.ThemeModeWasChanged.name,
                handler: (command: Luckygames.Message.ThemeModeWasChanged) => this.sponsor.setOptionTheme(command.mode)
            }
        ];
    }    
}

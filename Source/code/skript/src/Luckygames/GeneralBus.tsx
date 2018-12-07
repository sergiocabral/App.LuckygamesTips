namespace Skript.Luckygames {

    /**
     * Despachador de mensagens.
     */
    export class GeneralBus extends Core.Bus.MessageBus<typeof General> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Message.SetThemeMode.name,
                handler: (command: Message.SetThemeMode) => command.result = { mode: this.sponsor.theme(command.mode) }
            },
            {                
                message: Message.GetThemeMode.name,
                handler: (command: Message.GetThemeMode) => command.result = { mode: this.sponsor.theme() }
            },
            {                
                message: Message.SetAnimationMode.name,
                handler: (command: Message.SetAnimationMode) => command.result = { mode: this.sponsor.animation(command.mode) }
            },
            {                
                message: Message.GetAnimationMode.name,
                handler: (command: Message.GetAnimationMode) => command.result = { mode: this.sponsor.animation() }
            }
        ];
    }    
}

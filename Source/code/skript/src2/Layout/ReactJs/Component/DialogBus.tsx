namespace Skript.Layout.ReactJs.Component {

    /**
     * Despachador de mensagens.
     */
    export class DialogBus extends Core.Bus.MessageBus<Dialog> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Core.Message.ShortcutKey.name,
                handler: (command: Core.Message.ShortcutKey) => !this.sponsor.shortcut(command.evt)
            }
        ];
    }    
}

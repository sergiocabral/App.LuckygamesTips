namespace Skript.Layout {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Despachador de mensagens.
     */
    export class PresentationBus extends Core.Bus.MessageBus<Presentation> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Message.DialogCreate.name,
                handler: (command: Message.DialogCreate) => {
                    command.result = { dialog: skript.presentation.createDialog({ 
                        title: command.title, 
                        icon: command.icon,
                        closeMode: command.closeMode,
                        className: command.className,
                        size: command.size,
                        position: command.position
                    }, command.children) };
                }
            },
            {                
                message: Message.MainDialogToggle.name,
                handler: () => {
                    skript.presentation.mainDialogToggle();
                }
            },
            {
                message: Message.AppendToMainDialog.name,
                handler: (command: Message.AppendToMainDialog) => {
                    skript.presentation.appendToMainDialog(command.children);
                }
            },
            {
                message: Core.Message.LogMessagePosted.name,
                handler: (command: Core.Message.LogMessagePosted) => {
                    skript.presentation.message(command.message);
                }
            }
        ];
    }    
}

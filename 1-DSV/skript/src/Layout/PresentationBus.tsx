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
                        size: command.size
                    }, command.children) };
                }
            },
            {                
                message: Message.MainDialogToggle.name,
                handler: () => {
                    skript.presentation.mainDialogVisible(!skript.presentation.mainDialogVisible());                    
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

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
                    command.result = skript.presentation.createDialog({ title: command.title, closeMode: command.closeMode }, command.children);
                    return command;
                }
            },
            {                
                message: Message.MainDialogToggle.name,
                handler: (command: Message.MainDialogToggle) => {
                    skript.presentation.mainDialog.visible(!skript.presentation.mainDialog.visible());
                    return command;
                }
            },
            {
                message: Message.AppendToMainDialog.name,
                handler: (command: Message.AppendToMainDialog) => {
                    command.result = skript.presentation.appendToMainDialog(command.children);
                    return command;
                }
            }
        ];
    }    
}

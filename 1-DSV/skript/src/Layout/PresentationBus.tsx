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
                    command.result = 
                        ReactDOM.render(
                            React.createElement(ReactJs.Component.Dialog, { 
                                title: command.title,                                 
                                closeMode: command.closeMode
                            }, command.children), 
                            skript.presentation.createContainer());

                    return command;
                }
            },
            {                
                message: Message.MainDialogToggle.name,
                handler: (command: Message.MainDialogToggle) => {
                    skript.presentation.mainDialog.visible(!skript.presentation.mainDialog.visible());
                    return command;
                }
            }
        ];
    }    
}

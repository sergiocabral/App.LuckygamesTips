namespace Skript.Layout {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Despachador de mensagens.
     */
    export class PresentationDispatcher extends Core.Bus.MessageDispatcher<Presentation> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Message.DialogCreate.name,
                handler: (command: Message.DialogCreate) => {
                    command.result = 
                        ReactDOM.render(
                            React.createElement(ReactJs.Component.Dialog, { title: command.title }, command.children), 
                            skript.presentation.createContainer());

                    return command;
                }
            },
            {                
                message: Message.MainDialogToggle.name,
                handler: (command: Message.MainDialogToggle) => {
                    command.result = Core.Bus.MessageDispatcher.Send(new Message.DialogCreate(skript.configuration.name, <p>Main Windows</p>)).result;

                    return command;
                }
            }
        ];
    }    
}

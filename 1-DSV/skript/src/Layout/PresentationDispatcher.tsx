namespace Layout {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const all: Core.All;

    /**
     * Despachador de mensagens.
     */
    export class PresentationDispatcher extends Core.Bus.MessageDispatcher<Presentation> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Message.CreateDialog.name,
                handler: (command: Message.CreateDialog) => {
                    const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
                    container.id = Util.String.random();
                    all.presentation.container.appendChild(container);

                    command.result = ReactDOM.render(React.createElement(Component.Dialog, { title: command.title }, null), container);

                    return command;
                }
            }
        ];
    }    
}

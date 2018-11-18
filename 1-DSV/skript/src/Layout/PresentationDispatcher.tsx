namespace Layout {

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
                    return this.sponsor.react.commandCreateDialog(command);
                }
            }
        ];
    }    
}

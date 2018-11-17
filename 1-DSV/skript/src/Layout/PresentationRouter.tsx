namespace Layout {

    /**
     * Evento ao criar uma nova janela de diálogo.
     */
    export class PresentationRouter extends Core.Bus.Router<Presentation> {

        /**
         * Lista de comandos possíveis de serem processados.
         */
        public handlers: Core.Bus.CommandHandler[] = [ 
            {                
                command: Command.CreateDialog.name,
                handler: (command: Command.CreateDialog) => {
                    return this.sponsor.react.commandCreateDialog(command);
                }
            }
        ];
    }    
}

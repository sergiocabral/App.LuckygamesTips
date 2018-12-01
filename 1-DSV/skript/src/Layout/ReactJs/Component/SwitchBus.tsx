namespace Skript.Layout.ReactJs.Component {

    /**
     * Despachador de mensagens.
     */
    export class SwitchBus extends Core.Bus.MessageBus<Switch> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Message.SwitchUncheck.name,
                handler: (command: Message.SwitchUncheck) => {
                    if (command.instance !== this.sponsor && command.radio === this.sponsor.props.radio) {
                        this.sponsor.checked(false);                        
                    }
                }
            }
        ];
    }    
}

namespace Skript.Core {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Despachador de mensagens.
     */
    export class MainBus extends Core.Bus.MessageBus<Main> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Message.RegisterPart.name,
                handler: (command: Message.RegisterPart) => {
                    command.result = skript.main.registerPart(command.part);
                    return command;
                }
            }
        ];
    }    
}

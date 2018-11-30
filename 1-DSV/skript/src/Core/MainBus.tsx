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
                message: Message.SystemLoaded.name,
                handler: () => skript.log.post("Great! Tips were loaded successfully.")
            },
            {
                message: Message.RegisterPart.name,
                handler: (command: Message.RegisterPart) => command.result = { tools: skript.main.registerPart(command.part) }
            }
        ];
    }    
}

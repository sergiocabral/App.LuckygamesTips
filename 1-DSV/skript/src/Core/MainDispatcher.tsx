namespace Skript.Core {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Despachador de mensagens.
     */
    export class MainDispatcher extends Core.Bus.MessageDispatcher<Main> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Message.RegisterModule.name,
                handler: (command: Message.RegisterModule) => {
                    skript.main.registerModule(command.module);
                    return command;
                }
            }
        ];
    }    
}

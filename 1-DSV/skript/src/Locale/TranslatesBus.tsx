namespace Skript.Locale {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Despachador de mensagens.
     */
    export class TranslatesBus extends Core.Bus.MessageBus<Translates> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Message.SetLanguage.name,
                handler: (command: Message.SetLanguage) => {
                    command.result = skript.translate.setLanguage(command.language);
                }
            }
        ];
    }    
}

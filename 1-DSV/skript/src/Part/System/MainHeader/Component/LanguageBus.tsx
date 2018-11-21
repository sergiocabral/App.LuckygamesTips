namespace Skript.Part.System.MainHeader.Component {

    /**
     * Despachador de mensagens.
     */
    export class LanguageBus extends Core.Bus.MessageBus<Language> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Locale.Message.LanguageChanged.name,
                handler: (command: Locale.Message.LanguageChanged) => {
                    if (!this.sponsor.exists()) return;
                    this.sponsor.setLanguage(command.newLanguage);
                    return command;
                }
            }
        ];
    }    
}

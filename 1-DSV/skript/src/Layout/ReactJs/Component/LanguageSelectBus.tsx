namespace Skript.Layout.ReactJs.Component {

    /**
     * Despachador de mensagens.
     */
    export class LanguageSelectBus extends Core.Bus.MessageBus<LanguageSelect> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {
                message: Locale.Message.LanguageChanged.name,
                handler: (command: Locale.Message.LanguageChanged) => {
                    if (!this.sponsor.exists()) return this.dispose();
                    this.sponsor.setLanguage(command.newLanguage);
                }
            }
        ];
    }    
}

namespace Skript.Automation {

    /**
     * Despachador de mensagens.
     */
    export class ParametersBus extends Core.Bus.MessageBus<typeof Parameters> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [ 
            {                
                message: Message.GetCurrentSettings.name,
                handler: (command: Message.GetCurrentSettings) => command.result = { settings: this.sponsor.currentSettings() }
            },
            {                
                message: Message.GetDefaultSettings.name,
                handler: (command: Message.GetDefaultSettings) => command.result = { settings: this.sponsor.defaultSettings() }
            },
            {
                message: Message.GetSavedParameters.name,
                handler: (command: Message.GetSavedParameters) => command.result = { parameters: this.sponsor.parameters() }
            },
            {
                message: Message.SaveSettingsToParameter.name,
                handler: (command: Message.SaveSettingsToParameter) => this.sponsor.save(command.name, command.settings)
            }
        ];
    }    
}

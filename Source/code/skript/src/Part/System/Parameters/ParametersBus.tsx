namespace Skript.Part.System.Parameters {

    /**
     * Componente principal do módulo.
     */
    export class ParametersBus extends Core.Bus.MessageBus<Parameters.Parameters> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [
            {
                message: Automation.Message.ParametersUpdated.name,
                handler: () => this.sponsor.load()
            }
        ];
    }
}

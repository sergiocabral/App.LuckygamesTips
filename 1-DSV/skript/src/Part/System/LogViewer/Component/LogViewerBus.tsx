namespace Skript.Part.System.LogViewer.Component {

    /**
     * Componente principal do módulo.
     */
    export class LogViewerBus extends Core.Bus.MessageBus<LogViewer> {

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public handlers: Core.Bus.MessageHandler[] = [
            {
                message: Core.Message.LogMessagePosted.name,
                handler: (command: Core.Message.LogMessagePosted) => this.sponsor.post(command.message)
            },
            {
                message: Core.Message.LogMessageCleared.name,
                handler: () => this.sponsor.clear()
            }
        ];
    }
}

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
                handler: (command: Core.Message.LogMessagePosted) => {
                    if (!this.sponsor.exists()) return this.dispose();
                    this.sponsor.post(command.message);
                }
            }
        ];
    }
}

namespace Skript.Parts {
    
    /**
     * Classe base para os módulos do sistema.
     */
    export abstract class PartBase {

        /**
         * Construtor.
         */
        public constructor() {
            const command = Core.Bus.MessageBus.Send(new Core.Message.RegisterPart(this));
            this.tools = command.result;
        }

        /**
         * Conjunto de ferramentas para uso do módulo.
         */
        public tools: Tools;

        /**
         * Chamado quando o módulo é carregado.
         */
        public abstract loaded(): void;

    }
}

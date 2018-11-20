namespace Skript.Parts {
    
    /**
     * Classe base para os módulos do sistema.
     */
    export abstract class PartBase {

        /**
         * Construtor.
         */
        public constructor() {
            this.tools = Core.Bus.MessageDispatcher.Send(new Core.Message.RegisterPart(this)).result as Tools;
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

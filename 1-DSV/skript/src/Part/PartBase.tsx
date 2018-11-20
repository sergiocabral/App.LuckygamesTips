namespace Skript.Part {
    
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

        /**
         * Componente para inclusão na janela .
         * @returns {React.ReactNode} Qualquer coisa que seja adicionado como children em um component React.
         */
        public abstract component(): React.ReactNode;

    }
}

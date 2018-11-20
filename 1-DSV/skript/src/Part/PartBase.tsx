namespace Skript.Part {
    
    /**
     * Classe base para os módulos do sistema.
     */
    export abstract class PartBase {

        /**
         * Rgistra o módulo.
         */
        public register() {
            this.tools = Core.Bus.MessageBus.Send(new Core.Message.RegisterPart(this)).result;

            Core.Bus.MessageBus.Send(new Layout.Message.AppendToMainDialog(this.component()));

            this.tools.log.post("Módulo carregado: {0}", this.name);

            this.loaded();
        }

        /**
         * Conjunto de ferramentas para uso do módulo.
         */
        public tools: Tools = { } as Tools;

        /**
         * Nome identificador do módulo.
         */
        public abstract name: string;

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

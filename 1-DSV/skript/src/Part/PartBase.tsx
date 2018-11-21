namespace Skript.Part {
    
    /**
     * Classe base para os módulos do sistema.
     */
    export abstract class PartBase {

        /**
         * Rgistra o módulo.
         */
        public register() {
            this.tools = new Core.Message.RegisterPart(this).send().result;

            new Layout.Message.AppendToMainDialog(this.component()).send();

            this.tools.log.post("Module loaded: {0}", this.name);

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

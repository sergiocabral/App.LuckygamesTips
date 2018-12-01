namespace Skript.Part {
    
    /**
     * Classe base para os módulos do sistema.
     */
    export abstract class PartBase {

        /**
         * Rgistra o módulo.
         */
        public register() {
            const messageBus = new Core.Message.RegisterPart(this).sendSync();
            if (!messageBus.result) throw new Core.Errors.NullNotExpected("Message.RegisterPart.result");
            this.tools = messageBus.result.tools;

            new Layout.Message.AppendToMainDialog(this.component()).sendAsync();

            this.tools.log.post("Module loaded: {0}", this.name, Core.Log.Level.Debug);

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

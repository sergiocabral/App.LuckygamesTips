namespace Skript.Part {
    
    /**
     * Classe para criação e registro de módulos no sistema.
     */
    export class Part {

        /**
         * Construtor
         * @param name Nome do módulo.
         * @param {typeof React.ReactNode} typeofComponent Tipo do componente.
         */
        public constructor(name: string, typeofComponent: any) {
            this.name = name;
            this.typeofComponent = typeofComponent;
            this.register();
        }

        /**
         * Nome identificador do módulo.
         * @type {string}
         */
        public name: string;

        /**
         * Tupo do componente.
         * @type {typeof React.ReactNode}
         */
        public typeofComponent: any;
        
        /**
         * Componente para inclusão na janela .
         * @returns {React.ReactNode} Qualquer coisa que seja adicionado como children em um component React.
         */
        public component: () => React.ReactNode = () => React.createElement(this.typeofComponent, null, null);
  
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
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void { }
    }
}

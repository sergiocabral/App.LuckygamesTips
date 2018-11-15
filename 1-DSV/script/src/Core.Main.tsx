namespace Core {

    /**
     * Dados da configuração de inicialização do sistema.
     */
    type InitializeConfig = {

        /**
         * Indica se a execução está em modo DEBUG.
         */
        debug: boolean
    }

    /**
     * Classe principal
     */
    export class Main {

        /**
         * Traduções.
         */
        private static translates: Translates = new Translates(
            [
                {
                    key: "Não é permitido mais de uma chamada da função Main.initialize().",
                    translates: [
                        { language: "en", text: "Not allowed more than one call Main.initialize() function." }
                    ]
                }            
            ]
        );

        /**
         * Singleton. Instância única da classe principal.
         */
        private static instance: Main;

        /**
         * Singleton. Retorna a instância da classe principal do sistema.
         * @param  {InitializeConfig} initializeConfig Configuração de inicialização do sistema.
         * @returns Main
         */
        public static initialize(initializeConfig: InitializeConfig): void {
            if (typeof(Main.instance) !== "object") {            
                Main.instance = new Main(initializeConfig);
            } else {
                throw new Error(Main.translates.get("Não é permitido mais de uma chamada da função Main.initialize()."));
            }
        }

        /**
         * Configuração de inicialização do sistema.
         */
        public static initializeConfig: InitializeConfig;        

        /**
         * Construtor.
         * @param  {InitializeConfig} initializeConfig Configuração de inicialização do sistema.
         */
        private constructor(initializeConfig: InitializeConfig) {
            Main.initializeConfig = initializeConfig;
            this.loadReferences().then(() => {
                Visual.Layout.initialize();
                Visual.Layout.createDialog("Luckygames Tips 2");
                Visual.Layout.createDialog("Luckygames Tips");
            });
        }

        /**
         * Carrega as bibliotecas de terceitos.
         */
        private loadReferences(): Promise<void> {
            return new Promise(resolve => {
                const libs: string[] = [];

                if (Main.initializeConfig.debug) {
                    libs.push("https://unpkg.com/react@16/umd/react.development.js");
                    libs.push("https://unpkg.com/react-dom@16/umd/react-dom.development.js");
                } else {
                    libs.push("https://unpkg.com/react@16/umd/react.production.min.js");
                    libs.push("https://unpkg.com/react-dom@16/umd/react-dom.production.min.js");
                }
                libs.push("https://use.fontawesome.com/releases/v5.5.0/css/all.css");
                libs.push("https://fonts.googleapis.com/css?family=Concert+One|Hind+Siliguri");
                libs.push("https://dsv.luckygames.tips/script?react");

                Util.Load.libraries(libs).then(resolve);
            })
        }
    }
}
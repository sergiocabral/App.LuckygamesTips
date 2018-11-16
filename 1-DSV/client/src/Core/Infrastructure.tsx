namespace Core {

    /**
     * Classe principal responsável por rodar o sistema.
     * Aqui ficam definições de infraestrutura.
     */
    export class Infrastructure {

        /**
         * Construtor.
         * @param {Configuration} configuration Configuração para inicialização do sistema.
         */
        public constructor(configuration: Configuration) {
            window.anything = { };
            
            const api = new Api.Request(configuration.server);

            this.loadReferences(configuration.debug).then(() => {
                api.loadScript([Api.ScriptContext.React]).then(() => {
                    api.loadData([
                        { type: Api.DataType.Theme, name: "default", data: "" }
                    ]).then((data) => {
                        const configurationLazy: ConfigurationLazy = {
                            colors: JSON.parse(data[0].data) as Layout.Theme.Colors
                        };
                        new Main(configuration, configurationLazy);
                    });
                });
            });
        }

        /**
         * Carrega as bibliotecas de terceitos.
         * @param {boolean} isDebug Aplica um carregamento customizado para ambiente de debug.
         */
        private loadReferences(isDebug: boolean): Promise<void> {
            return new Promise(resolve => {
                const libs: string[] = [];

                if (isDebug) {
                    libs.push("https://unpkg.com/react@16/umd/react.development.js");
                    libs.push("https://unpkg.com/react-dom@16/umd/react-dom.development.js");
                } else {
                    libs.push("https://unpkg.com/react@16/umd/react.production.min.js");
                    libs.push("https://unpkg.com/react-dom@16/umd/react-dom.production.min.js");
                }
                libs.push("https://use.fontawesome.com/releases/v5.5.0/css/all.css");
                libs.push("https://fonts.googleapis.com/css?family=Raleway|Hind+Siliguri");

                Util.LoadReferences.libraries(libs).then(resolve);
            })
        }
    }
}
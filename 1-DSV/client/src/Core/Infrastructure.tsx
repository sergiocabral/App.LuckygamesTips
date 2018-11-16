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

            Core.Log.History.setInstance(new Log.History(configuration.debug));
            Core.Api.Request.setInstance(new Api.Request(configuration.server));
            Core.Translate.Translates.setInstance(new Core.Translate.Translates("pt"));

            this.configuration = configuration;

            this.loadReferences(configuration.debug).then(() => {
                Core.Api.Request.getInstance().loadScript([Api.ScriptContext.React]).then(() => {
                    Core.Api.Request.getInstance().loadData([
                        { type: Api.DataType.Theme, name: "default", data: "" },
                        { type: Api.DataType.Translate, name: Core.Translate.Translates.getInstance().languageDefault, data: "" }
                    ]).then((data) => {
                        new Main(this, {
                            colors: JSON.parse(data[0].data) as Layout.Theme.Colors,
                            translates: !data[1].data ? [] : (JSON.parse(data[1].data) as []).map(i => { return { 
                                language: Core.Translate.Translates.getInstance().languageDefault,
                                id: Object.keys(i)[0] as string,
                                translated: i[Object.keys(i)[0]] as string
                            }})
                        });
                    });
                });
            });
        }

        /**
         * Conjunto de propriedades que configuram o sistema.
         * @type {Configuration}
         */
        public configuration: Configuration;

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
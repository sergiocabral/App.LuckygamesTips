namespace Core {

    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const all: Core.All;

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
            all.infrastructure = this;
            
            window.anything = { };

            const language = "en";

            all.configuration = configuration;
            new Log.History();
            new Api.Request(configuration.server);
            new Locale.Translates(language);

            if (configuration.welcome) {
                Log.ConsoleLog.welcome(configuration.name, language.toString() === "pt" ? 
                    "Uma maneira de fazer muito mais. Obrigado pelo apoio." :
                    "A way to do much more. Thanks for the support.");
            }

            this.loadReferences(configuration.debug).then(() => {
                all.api.loadScript([Api.ScriptContext.React]).then(() => {
                    all.api.loadData([
                        { type: Api.DataType.Theme, name: "default", data: "" },
                        { type: Api.DataType.Translate, name: all.translate.languageDefault, data: "" },
                        { type: Api.DataType.Locale, name: all.translate.languageDefault, data: "" }
                    ]).then((data) => {
                        let translates: Locale.Translate[];
                        try {
                            translates = Locale.Translates.parse(data[1].data);
                        } catch (ex) {
                            all.log.post("Não foi possível carregar as traduções de idioma.", null, Log.Level.Error, ex);
                            translates = [];
                        }
                        
                        let colors: Layout.Theme.Colors;
                        try {
                            colors = Layout.Theme.Stylesheet.parse(data[0].data);
                        } catch (ex) {
                            all.log.post("Não foi possível carregar o tema de cores do layout.", null, Log.Level.Error, ex);
                            colors = Layout.Theme.Stylesheet.getColorsDefault();
                        }

                        let locale: Locale.FormatSet;
                        try {
                            locale = Locale.Formats.parse(data[2].data);
                        } catch (ex) {
                            all.log.post("Não foi possível carregar as informações de localização e região.", null, Log.Level.Error, ex);
                            locale = {
                                date: Util.DateTime.defaultDateFormat,
                                number: Util.Number.defaultNumberFormat,
                            }
                        }

                        all.data = { 
                            colors: colors,
                            translates: translates, 
                            locale: locale 
                        };
                        new Main();
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
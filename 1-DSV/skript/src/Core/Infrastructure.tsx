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

            this.configuration = configuration;

            const language = "en";

            if (configuration.welcome) {
                Log.History.welcome(configuration.name, language.toString() === "pt" ? 
                    "Uma maneira de fazer muito mais. Obrigado pelo apoio." :
                    "A way to do much more. Thanks for the support.");
            }

            Core.Log.History.setInstance(new Log.History(configuration.debug));
            Core.Api.Request.setInstance(new Api.Request(configuration.server));
            Locale.Translates.setInstance(new Locale.Translates(language));

            this.loadReferences(configuration.debug).then(() => {
                Core.Api.Request.getInstance().loadScript([Api.ScriptContext.React]).then(() => {
                    Core.Api.Request.getInstance().loadData([
                        { type: Api.DataType.Theme, name: "default", data: "" },
                        { type: Api.DataType.Translate, name: Locale.Translates.getInstance().languageDefault, data: "" },
                        { type: Api.DataType.Locale, name: Locale.Translates.getInstance().languageDefault, data: "" }
                    ]).then((data) => {
                        let translates: Locale.Translate[];
                        try {
                            translates = Locale.Translates.parse(data[1].data);
                        } catch (ex) {
                            Core.Log.History.getInstance().post("Não foi possível carregar as traduções de idioma.", null, Log.Level.Error, ex);
                            translates = [];
                        }
                        
                        let colors: Layout.Theme.Colors;
                        try {
                            colors = Layout.Theme.Stylesheet.parse(data[0].data);
                        } catch (ex) {
                            Core.Log.History.getInstance().post("Não foi possível carregar o tema de cores do layout.", null, Log.Level.Error, ex);
                            colors = Layout.Theme.Stylesheet.getColorsDefault();
                        }

                        let locale: Locale.FormatSet;
                        try {
                            locale = Locale.Formats.parse(data[2].data);
                        } catch (ex) {
                            Core.Log.History.getInstance().post("Não foi possível carregar as informações de localização e região.", null, Log.Level.Error, ex);
                            locale = {
                                date: Util.DateTime.defaultDateFormat,
                                number: Util.Number.defaultNumberFormat,
                            }
                        }

                        new Main(this, { colors: colors, translates: translates, locale: locale });
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
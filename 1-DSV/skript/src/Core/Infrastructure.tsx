namespace Core {

    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const tips: Core.All;

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
            tips.infrastructure = this;

            const language: string = "en";

            tips.configuration = configuration;
            new Log.History();
            new Api.Request(configuration.server);
            new Locale.Translates(language);

            this.showWelcomeMessageInConsole();

            this.loadReferences(configuration.debug).then(() => {
                tips.api.loadScript([Api.ScriptContext.React]).then(() => {
                    tips.api.loadData([
                        { type: Api.DataType.Translate, name: tips.translate.languageDefault, data: "" },
                        { type: Api.DataType.Theme, name: "default", data: "" },
                        { type: Api.DataType.Locale, name: tips.translate.languageDefault, data: "" }
                    ]).then((data) => {
                        let translates: Locale.Translate[];
                        try {
                            translates = Locale.Translates.parse(data[0].data);
                        } catch (error) {
                            tips.log.post("Não foi possível carregar as traduções de idioma.", null, Log.Level.Error, error);
                            translates = [];
                        }
                        
                        let colors: Layout.Theme.Colors;
                        try {
                            colors = Layout.Theme.Stylesheet.parse(data[1].data);
                        } catch (error) {
                            tips.log.post("Não foi possível carregar o tema de cores do layout.", null, Log.Level.Error, error);
                            colors = Layout.Theme.Stylesheet.getColorsDefault();
                        }

                        let locale: Locale.FormatSet;
                        try {
                            locale = Locale.Formats.parse(data[2].data);
                        } catch (error) {
                            tips.log.post("Não foi possível carregar as informações de localização e região.", null, Log.Level.Error, error);
                            locale = {
                                date: Util.DateTime.defaultDateFormat,
                                number: Util.Number.defaultNumberFormat,
                            }
                        }

                        tips.data = { 
                            colors: colors,
                            translates: translates, 
                            locale: locale 
                        };
                        new Main();
                    }).catch(() => {
                        this.fatalError("Error on load data.");
                    });
                }).catch(error => {
                    this.fatalError("Error on load: " + error.url);
                });
            }).catch(error => {
                this.fatalError("Error on load: " + error.url);
            });
        }

        /**
         * Exibe uma mensagem amigável de boas-vindas no console do navegador.
         */
        private showWelcomeMessageInConsole(): void {
            if (tips.configuration.welcome) {
                Log.ConsoleLog.welcome(tips.configuration.name, tips.translate.languageDefault === "pt" ? 
                    "Uma maneira de fazer muito mais. Obrigado pelo apoio." :
                    "A way to do much more. Thanks for the support.");
            }
        }

        private fatalError(error: string = ""): void {
            alert(
                `${tips.configuration.name}\n\n` + 
                `Opa! Desculpe dizer, mas houve uma falha na conexão com a Internet que impediu o carregamento do Luckygames Tips. Por favor, atualize a página para tentar novamente.\n\n` + 
                `Oops! Sorry to say, but there was a failure in the Internet connection that prevented the loading of Luckygames Tips. Please refresh the page to try again.` + 
                (error ? "\n\n" + error : ""));
        }

        /**
         * Carrega as bibliotecas de terceitos.
         * @param {boolean} isDebug Aplica um carregamento customizado para ambiente de debug.
         */
        private loadReferences(isDebug: boolean): Promise<void> {
            return new Promise((resolve, reject) => {
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

                Util.LoadReferences.libraries(libs).then(resolve).catch(reject);
            });
        }
    }
}
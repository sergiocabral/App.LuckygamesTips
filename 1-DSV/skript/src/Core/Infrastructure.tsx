namespace Skript.Core {

    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

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
            if (configuration.server.substr(-1) === "/") configuration.server = configuration.server.substr(0, configuration.server.length - 1);

            skript.infrastructure = skript.infrastructure ? skript.infrastructure : this;

            skript.configuration = configuration;
            new Log.History(); skript.log.post("Loading Tips...", null, Log.Level.Debug);
            new Data.Storage("luckygames.tips");
            new Api.Request(configuration.server);
            new Locale.Translates(skript.storage.data().language);

            this.showWelcomeMessageInConsole();

            this.loadReferences(configuration.debug).then(() => {
                skript.api.loadScript([Api.ScriptContext.React]).then(() => {

                    const data: Api.Data[] = [
                        { type: Api.DataType.Translate, name: skript.translate.languageDefault, data: "" },
                        { type: Api.DataType.Theme, name: "default", data: "" },
                        { type: Api.DataType.Locale, name: skript.translate.languageDefault, data: "" }
                    ];

                    skript.api.loadData(data).then((response) => {
                        try {
                            skript.data = this.extractData(response, data);
                            skript.log.post("The configuration data has been loaded.", null, Log.Level.Debug, skript.data);

                            new Main();
                        } catch (error) {
                            this.fatalError("System error: " + error);
                        }

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
            if (!skript.configuration.noWelcomeMessage) {
                Log.ConsoleLog.welcome(skript.configuration.name, skript.translate.languageDefault === "en" ? 
                "do more, much more. Thanks for the support." :
                "Faça mais, muito mais. Obrigado pelo apoio.");
            }
        }

        private fatalError(error: string = ""): void {
            alert(
                `${skript.configuration.name}\n\n` + 
                `Oops! Sorry to say, but there was a failure in the Internet connection that prevented the loading of Luckygames skript. Please refresh the page to try again.\n\n` + 
                `Opa! Desculpe dizer, mas houve uma falha na conexão com a Internet que impediu o carregamento do Luckygames skript. Por favor, atualize a página para tentar novamente.` + 
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
                libs.push("https://fonts.googleapis.com/css?family=Raleway|Hind+Siliguri|Share+Tech+Mono");
                libs.push(`${skript.configuration.server}/media/FastForward/font.css`);

                Util.LoadReferences.libraries(libs).then(resolve).catch(reject);
            });
        }

        /**
         * Extrai e valida os dados carregados do servidor.
         * @param response Resposta do servidor com os dados carregados.
         * @param data Dados originais enviados ao servidor.
         * @returns {Data} Dados originais enriquecidos com retorno do servidor.
         */
        private extractData(response: string[], data: Api.Data[]): Data {
            const result: Data = {
                translates: [],
                colors: Layout.Theme.Stylesheet.getColorsDefault(),
                locale: {
                    date: Util.DateTime.defaultDateFormat,
                    number: Util.Numeric.defaultNumberFormat,
                }
            };

            if (data.length === response.length) {
                for (let i = 0; i < data.length; i++) data[i].data = response[i];
            } else if (response.length === 1) {
                try {
                    const json = JSON.parse(response[0]);
                    for (let i = 0; i < json.length; i++) data[i].data = JSON.stringify(json[i]);
                } catch (error) {
                    skript.log.post("Failed to load data: {0}", data.reduce((p, c) => { p += (p ? ", " : "") + Api.DataType[c.type]; return p}, ""), Log.Level.Error, error);
                    return result;
                }
            } else {
                throw new Core.Errors.InvalidData(`Infrastructure.extractData(), request(${data.length}) === response(${response.length})`);
            }

            for (let i = 0; i < data.length; i++) {                
                try {
                    switch (data[i].type) {
                        case Api.DataType.Translate:
                            result.translates = Locale.Translates.parse(data[i].data);                            
                            break;
                        case Api.DataType.Theme:
                            result.colors = Layout.Theme.Stylesheet.parse(data[i].data);
                            break;
                        case Api.DataType.Locale:
                            result.locale = Locale.Formats.parse(data[i].data);
                            break;
                    }
                } catch (error) {
                    skript.log.post("Failed to load data: {0}", Api.DataType[data[i].type], Log.Level.Error, error);
                }
            }

            return result;
        }
    }
}
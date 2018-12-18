namespace Skript.Framework.Core {

    /**
     * Classe principal do sistema.
     */
    export abstract class Main<TConfiguration, TStoragePacket extends Data.StoragePacket, TStoragePacketDefault extends Data.StoragePacketDefault> {

        /**
         * Instância desta classe.
         * @type {Main}
         */
        public static instance: Main<any, any, any>;

        /**
         * Método chamado para inicializar o sistema.
         */
        protected abstract initialize(): void;

        /**
         * Construtor.
         * @param {MainConfiguration<TConfiguration>} configuration Dados para inicialização do sistema.
         */
        public constructor(public configuration: MainConfiguration<TConfiguration, TStoragePacketDefault>) {
            if (Main.instance) throw new Errors.InvalidExecution("Main cannot be instantiated multiple times.");
            Main.instance = this;

            this.debug = configuration.debug !== undefined ? configuration.debug : this.constructor.name === "Main";

            this.log = new Log.History(this.debug, true);
            this.log.post("Loading infrastructure...");

            Data.ServerVariables.initialize(configuration.server).then(() => {
                this.log.post("Server variables loaded.");

                this.api = new Request.Api({
                    urlData: Data.ServerVariables.urlData,
                    urlScript: Data.ServerVariables.urlScript
                });

                this.storage = new Data.Storage<TStoragePacket, TStoragePacketDefault>(configuration.storageName, this.configuration.storagePacketDefault);

                const language = this.storage.data().language;
                this.translate = new Data.Translate(language, true);
                this.log.post("Default language set: {0}", language);

                this.presentation = undefined as any;

                this.data = { };
                this.loadData(language).then(data => {
                    if (typeof(data) === "object" && !Errors.Base.isError(data)) {
                        this.setData(data, language);
                        this.log.post("Configuration data loaded.");
                    } else {
                        this.log.post("Failed to load configuration data.", undefined, Log.Level.Warning, undefined, data);
                    }

                    this.loadReferences(configuration.libraries.map(v => v.querystring({ url: Data.ServerVariables.urlMedia }))).then((error) => {
                        try {
                            if (error) throw new Errors.RequestFail("Failed to load components.", error);
                            else this.log.post("System components loaded.");

                            this.presentation = new Layout.Presentation({
                                className: this.configuration.className,
                                url: Data.ServerVariables.urlMedia
                            });

                            this.initialize();
                        } catch (error) {
                            alert(
                                `${configuration.name}\n\n` +
                                `Oops! Sorry to say, but there was a failure in the Internet connection that prevented the loading of ${configuration.name}. Please refresh the page to try again.\n\n` +
                                `Opa! Desculpe dizer, mas houve uma falha na conexão com a Internet que impediu o carregamento do ${configuration.name}. Por favor, atualize a página para tentar novamente.` +
                                (error ? "\n\n" + error : ""));
                            if (this.debug) throw error;
                        }
                    });
                });
            });
        }

        /**
         * Determina se a execução está em modo debug.
         * @type {boolean}
         */
        public debug: boolean;

        /**
         * Manipulador do log de mensagens.
         * @type {Log.History}
         */
        public log: Log.History;

        /**
         * Manipulador de chamadas api.
         * @type {Request.Api}
         */
        public api: Request.Api = undefined as any;

        /**
         * Manipula os dados no storage do browser.
         * @type {Data.Storage}
         */
        public storage: Data.Storage<TStoragePacket, TStoragePacketDefault> = undefined as any;

        /**
         * Consulta de textos traduzidos.
         * @type {Data.Translate}
         */
        public translate: Data.Translate = undefined as any;

        /**
         * Organiza e manipula o layout.
         * @type {Layout.Presentation}
         */
        public presentation: Layout.Presentation = undefined as any;

        /**
         * Conjunto de dados recebidos do servidor.
         * @type {MainData}
         */
        public data: MainData = undefined as any;

        /**
         * Carrega os módulos javascript e css.
         * @param {string[]} libraries Bibliotecas javascript e css para carregar.
         * @returns {Promise<Error|void>} Retorna o erro se houver. Do contrário retorna void.
         */
        public loadReferences(libraries: string[]): Promise<Error> {
            const defaults: string[] = [];
            if (this.debug) {
                defaults.push("https://unpkg.com/react@16/umd/react.development.js");
                defaults.push("https://unpkg.com/react-dom@16/umd/react-dom.development.js");
                defaults.push("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.css");
                defaults.push("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.js");
            } else {
                defaults.push("https://unpkg.com/react@16/umd/react.production.min.js");
                defaults.push("https://unpkg.com/react-dom@16/umd/react-dom.production.min.js");
                defaults.push("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css");
                defaults.push("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js");
            }
            defaults.push("https://use.fontawesome.com/releases/v5.5.0/css/all.css");

            for (let i = defaults.length - 1; i >= 0; i--) {
                if (libraries.indexOf(defaults[i]) < 0) libraries.unshift(defaults[i]);
            }

            return new Promise(resolve => {
                Util.Request.libraries(libraries).then(() => {
                    this.api.loadScript(["react"]).then(() => {
                        resolve();
                    }).catch(error => resolve(error));
                }).catch((error) => resolve(error));
            });
        }

        /**
         * Carrega dados do servidor.
         * @param {string} language Idioma dos dados.
         * @returns {Promise<MainData>} Dados carregados.
         */
        public loadData(language: string): Promise<MainData> {
            return new Promise(resolve => {
                const data: Types.KeyValue[] = [
                    { key: this.configuration.dataNameLocale, value: language },
                    { key: this.configuration.dataNameTranslate, value: language },
                ];

                this.api.loadData(data).then(response => {
                    try {
                        const responseObject = JSON.parse(response[0]) as any[];
                        responseObject.forEach((v, i) => data[i].state = v);
                        resolve({
                            locale: responseObject[0],
                            translate: responseObject[1]
                        });
                    } catch (error) {
                        resolve(error);
                    }
                }).catch(error => resolve(error));
            });
        }

        /**
         * Define os dados padrão do sistema.
         * @param {MainData} data Dados.
         * @param {string} language Idioma dos dados.
         */
        public setData(data: MainData, language: string): void {
            this.data = data;
            if (data && data.locale) {
                Util.NumericFormat.defaults(data.locale['numeric']);
                Util.DateTimeFormat.defaults(data.locale['datetime']);
            }
            if (data && data.translate) {
                this.translate.language = language;
                this.translate.load(data.translate, language);
            }
        }
    }
}
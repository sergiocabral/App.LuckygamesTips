namespace Skript.Business.Core {

    /**
     * Class principal do sistema.
     */
    export class Main extends Framework.Core.Main<MainConfiguration, Data.StoragePacket, Data.StoragePacketDefault> {

        /**
         * Instância.
         * @type {Main}
         */
        public static instance: Main;

        public constructor(configuration: MainConfiguration) {
            super({
                name: "Luckygames.Tips",
                business: configuration,
                className: "luckygames-components",
                dataNameLocale: "locale",
                dataNameTranslate: "translate",
                storageName: "luckygames",
                storagePacketDefault: new Data.StoragePacketDefault(),
                libraries: [
                    "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js", //Origem: https://cdnjs.com/libraries/ace
                    "https://use.fontawesome.com/releases/v5.5.0/css/all.css",
                    "https://fonts.googleapis.com/css?family=Raleway|Hind+Siliguri|Share+Tech+Mono",
                    "{url}FastForward/font.css"
                ],
                server: configuration.server,
            });
        }

        /**
         * Método chamado para inicializar o sistema.
         */
        protected initialize(): void {
            this.dataBusiness = { };
            this.loadDataBusiness().then(data => {
                if (typeof(data) === "object" && !Framework.Errors.Base.isError(data)) {
                    this.dataBusiness.colors = data.colors;
                    this.log.post("Theme colors loaded.");
                } else {
                    this.log.post("Failed to load Theme colors.", undefined, Framework.Log.Level.Warning, undefined, data);
                }

                this.theme = new Layout.Theme({
                    url: Framework.Data.ServerVariables.urlMedia,
                    spacing: Framework.Layout.Components.Base.spacing,
                    colors: this.dataBusiness.colors ? this.dataBusiness.colors : Layout.Theme.defaultColors(),
                });
                this.activator = Layout.Components.Activator.Activator.create();
            });
        }

        /**
         * Carrega dados do servidor.
         * @returns {Promise<MainData>} Dados carregados.
         */
        public loadDataBusiness(): Promise<MainData> {
            return new Promise(resolve => {
                const data: Framework.Types.KeyValue[] = [
                    { key: "theme", value: "default" },
                ];

                this.api.loadData(data).then(response => {
                    try {
                        const responseObject = JSON.parse(response[0]) as any[];
                        responseObject.forEach((v, i) => data[i].state = v);
                        if (!data.find(v => v.state)) throw new Framework.Errors.EmptyValue("All data business is empty.");
                        resolve({
                            colors: responseObject[0],
                        });
                    } catch (error) {
                        resolve(error);
                    }
                }).catch(error => resolve(error));
            });
        }

        /**
         * Conjunto de dados recebidos do servidor.
         * @type {MainData}
         */
        public dataBusiness: MainData = undefined as any;

        /**
         * Agrupa ações sobre o visual css do sistema.
         * @type {Layout.Theme}
         */
        public theme: Layout.Theme = undefined as any;

        /**
         * Componente principal do sistema
         * @type {Layout.Components.Activator.Activator}
         */
        public activator: Layout.Components.Activator.Activator = undefined as any;
    }
}
namespace Core {

    /**
     * O sistema funciona a partir desta classe.
     */
    export class Main {

        /**
         * Construtor.
         * @param {Configuration} configuration Configuração para inicialização do sistema.
         * @param {ConfigurationLazy} configurationLazy Configuração para inicialização do sistema carregada tardiamente.
         * @param {string} id Opcional. Identificador para uso geral.
         */
        public constructor(
            configuration: Configuration, 
            configurationLazy: ConfigurationLazy, 
            id: string = Util.String.random()) {

            this.id = id;
            this.configuration = configuration;
            this.configurationLazy = configurationLazy;
            this.api = new Api.Request(configuration.server);
            this.presentation = new Layout.Presentation(configurationLazy.colors);

            this.presentation.createDialog("Luckygames Tips");
        }

        /**
         * Identificador para uso geral.
         */
        public id: string;

        /**
         * Configuração de inicialização do sistema.
         */
        public configuration: Configuration;


        /**
         * Configuração para inicialização do sistema carregada tardiamente.
         */
        public configurationLazy: ConfigurationLazy;
        
        /**
         * Manipulador de chamadas api.
         */
        public api: Api.Request;

        /**
         * Organiza e manipula o layout.
         */
        public presentation: Layout.Presentation;        
    }
}
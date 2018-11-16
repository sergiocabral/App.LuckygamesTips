namespace Core {

    /**
     * O sistema funciona a partir desta classe.
     */
    export class Main {

        /**
         * Construtor.
         * @param {Infrastructure} infrastructure Instância da infraestrutura.
         * @param {ConfigurationLazy} configurationLazy Configuração para inicialização do sistema carregada tardiamente.
         * @param {string} id Opcional. Identificador para uso geral.
         */
        public constructor(infrastructure: Infrastructure, configurationLazy: ConfigurationLazy, id: string = Util.String.random()) {
            this.id = id;
            this.infrastructure = infrastructure;
            this.configurationLazy = configurationLazy;
            
            Core.Translate.Translates.getInstance().load(configurationLazy.translates);
            this.presentation = new Layout.Presentation(configurationLazy.colors);

            this.presentation.createDialog(infrastructure.configuration.name);
        }

        /**
         * Identificador para uso geral.
         */
        public id: string;

        /**
         * Configuração de inicialização do sistema.
         */
        public infrastructure: Infrastructure;

        /**
         * Configuração para inicialização do sistema carregada tardiamente.
         * @type {ConfigurationLazy}
         */
        public configurationLazy: ConfigurationLazy;

        /**
         * Organiza e manipula o layout.
         */
        public presentation: Layout.Presentation;        
    }
}
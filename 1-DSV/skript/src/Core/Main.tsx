namespace Core {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const all: Core.All;

    /**
     * O sistema funciona a partir desta classe.
     */
    export class Main {

        /**
         * Construtor.
         * @param {Infrastructure} infrastructure Instância da infraestrutura.
         * @param {ConfigurationLazy} configurationLazy Configuração para inicialização do sistema carregada tardiamente.
         */
        public constructor(infrastructure: Infrastructure, configurationLazy: ConfigurationLazy) {
            Events.Event.main = this;

            this.configuration = infrastructure.configuration;
            this.configurationLazy = configurationLazy;
            
            Util.DateTime.defaultDateFormat = configurationLazy.locale.date;
            Util.Number.defaultNumberFormat = configurationLazy.locale.number;

            all.translate.load(configurationLazy.translates);
            this.presentation = new Layout.Presentation(configurationLazy.colors);

            this.presentation.createDialog(infrastructure.configuration.name);
        }

        /**
         * Conjunto de propriedades que configuram o sistema.
         * @type {Configuration}
         */
        public configuration: Configuration;

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
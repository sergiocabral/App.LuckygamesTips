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
         * @param {ConfigurationLazy} configurationLazy Configuração para inicialização do sistema carregada tardiamente.
         */
        public constructor(configurationLazy: ConfigurationLazy) {
            all.configurationLazy = configurationLazy;
            
            Util.DateTime.defaultDateFormat = configurationLazy.locale.date;
            Util.Number.defaultNumberFormat = configurationLazy.locale.number;

            all.translate.load(configurationLazy.translates);
            
            all.presentation = new Layout.Presentation(configurationLazy.colors);

            all.presentation.createDialog(all.configuration.name);
        }
    }
}
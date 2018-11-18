namespace Core {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const tips: Core.All;

    /**
     * O sistema funciona a partir desta classe.
     */
    export class Main {

        /**
         * Construtor.
         * @param {ConfigurationLazy} configurationLazy Configuração para inicialização do sistema carregada tardiamente.
         */
        public constructor() {
            tips.main = this;

            Util.DateTime.defaultDateFormat = tips.data.locale.date;
            Util.Number.defaultNumberFormat = tips.data.locale.number;

            tips.translate.load(tips.data.translates);
            
            tips.presentation = new Layout.Presentation();

            Core.Bus.MessageDispatcher.Send(new Layout.Message.CreateDialog(tips.configuration.name));
        }
    }
}
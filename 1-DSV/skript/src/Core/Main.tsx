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
        public constructor() {
            all.main = this;

            Util.DateTime.defaultDateFormat = all.data.locale.date;
            Util.Number.defaultNumberFormat = all.data.locale.number;

            all.translate.load(all.data.translates);
            
            all.presentation = new Layout.Presentation();

            Core.Bus.MessageDispatcher.Send(new Layout.Message.CreateDialog(all.configuration.name));
        }
    }
}
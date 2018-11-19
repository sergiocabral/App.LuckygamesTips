namespace Skript.Core {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * O sistema funciona a partir desta classe.
     */
    export class Main {

        /**
         * Construtor.
         * @param {ConfigurationLazy} configurationLazy Configuração para inicialização do sistema carregada tardiamente.
         */
        public constructor() {
            skript.main = this;

            Util.DateTime.defaultDateFormat = skript.data.locale.date;
            Util.Number.defaultNumberFormat = skript.data.locale.number;

            skript.translate.load(skript.data.translates);
            
            skript.presentation = new Layout.Presentation();
        }
    }
}
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

            new MainDispatcher(this);

            Util.DateTime.defaultDateFormat = skript.data.locale.date;
            Util.Number.defaultNumberFormat = skript.data.locale.number;

            skript.translate.load(skript.data.translates);
            
            skript.presentation = new Layout.Presentation();

            this.loadModules();
        }

        private loadModules() {
            skript.api.loadScript([Api.ScriptContext.FreeModule]).then(() => { skript.log.post("Ótimo! O Tips foi carregado com sucesso.", null, Log.Level.Information); });
        }

        /**
         * Registra um novo módulo.
         * @param {Modules.ModuleBase} module Módulo.
         */
        public registerModule(module: Modules.ModuleBase): void {
            console.log("TODO: register", module);
        }
    }
}
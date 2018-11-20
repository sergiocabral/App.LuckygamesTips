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

            skript.api.loadScript([Api.ScriptContext.SystemPart])
                .then(() => { 
                    skript.log.post("Ótimo! O Tips foi carregado com sucesso."); 

                    setTimeout(() => {
                        skript.log.post("Carregando módulos disponíveis.");
                        skript.api.loadScript([Api.ScriptContext.PaidPart])
                            .then(() => { skript.log.post("Módulos carregados com sucesso."); })
                            .catch(() => { skript.log.post("Ops! Ocorreu uma falha na conexão com a internet. Tente novamente.", null, Log.Level.Error); });
                    }, 1000);
                });
        }

        /**
         * Lista de módulo carregados.
         */
        public parts: Parts.PartBase[] = [];

        /**
         * Registra um novo módulo.
         * @param {Parts.PartBase} part Módulo.
         */
        public registerPart(part: Parts.PartBase): void {
            this.parts.push(part);
            
            part.tools = {
                log: skript.log
            };

            part.loaded();
        }
    }
}
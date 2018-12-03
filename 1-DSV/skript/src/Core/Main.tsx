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
            skript.main = skript.main ? skript.main : this;

            new MainBus(this);

            Util.DateTime.defaultDateFormat = skript.data.locale.date;
            Util.Number.defaultNumberFormat = skript.data.locale.number;

            skript.translate.load(skript.data.translates);
            skript.log.post("Using from this point translated texts.", null, Core.Log.Level.Debug);
            
            Luckygames.WebSocketControl.initialize();

            skript.presentation = new Layout.Presentation();

            skript.log.post("Loading system modules.", null, Core.Log.Level.Debug);
            skript.api.loadScript([Api.ScriptContext.SystemPart])
                .then(() => { 
                    skript.log.post("Loading available modules.", null, Core.Log.Level.Debug);
                    skript.api.loadScript([Api.ScriptContext.FreePart, Api.ScriptContext.PaidPart])
                        .then(() => { 
                            skript.log.post("Modules loaded successfully.", null, Core.Log.Level.Debug); 
                            new Message.SystemLoaded().sendAsync();                            
                        })
                        .catch(() => skript.log.post("Oops! An internet connection failed. Try again.", null, Log.Level.Error));
                });

            window.addEventListener("keyup", this.onKey);
        }

        /**
         * Lista de módulo carregados.
         */
        public parts: Part.Part[] = [];

        /**
         * Registra um novo módulo.
         * @param {Part.Part} part Módulo.
         * @returns {Part.Tools} Disponibiliza o conjunto de ferramentas para uso dos módulos.
         */
        public registerPart(part: Part.Part): Part.Tools {
            this.parts.push(part);
            const tools: Part.Tools = {
                server: skript.configuration.server,
                log: skript.log
            };
            return tools;
        }

        /**
         * Captura eventos de tecla para implementar teclas de atalho.
         * @param {KeyboardEvent} evt Informações o evento.
         */
        private onKey(evt: KeyboardEvent): void {
            switch(evt.keyCode) {
                // Liste aqui as teclas de atalhos autorizadas.
                case 27: //ESC
                    new Message.ShortcutKey(evt).sendAsync();
                    break;
            }
        }
    }
}
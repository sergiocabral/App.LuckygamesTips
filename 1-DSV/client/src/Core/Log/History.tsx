namespace Core.Log {

    /**
     * Manipula e registra mensagens de log.
     */
    export class History {

        /**
         * Instância para uso global no sistema.
         * @type {History}
         */
        private static instance: History|undefined;

        /**
         * Define uma instância para uso global no sistema.
         * Só pode ser definido uma vez.
         * @param {History} instance Instância global.
         */
        public static setInstance(instance: History): void {
            if (this.instance) throw new Error(Locale.Translates.getInstance().get("Está é uma instância global de {name} e não pode ser redefinida.", { name: "History" }));
            this.instance = instance;
            instance.post(`Log iniciado.`, Core.Log.Level.Debug);
        }
        
        /**
         * Retorna a instância de uso global.
         * @returns {History} Instância global.
         */
        public static getInstance(): History {
            if (!this.instance) throw new Error(Locale.Translates.getInstance().get("Está instância global de {name} ainda não foi definida.", { name: "History" }));
            return this.instance;
        }

        /**
         * Construtor.
         * @param {boolean} isDebug Indica se o sistema está em modo debug.
         */
        public constructor(isDebug: boolean) {
            this.isDebug = isDebug;
        }

        /**
         * Indica se o sistema está em modo debug.
         * @type {boolean}
         */
        public isDebug: boolean;

        /**
         * Lista de mensagens de log.
         * @type {Message[]}
         */
        public messages: Message[] = [];
        
        /**
         * Registra uma mensagem de log
         * @param {string} message Mensagem.
         * @param {Level} level Nível da mensagem.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         */
        public post(text: string, level: Level, values: any = { }): void {
            const message: Message = {
                time: new Date(),
                level: level,
                text: text.querystring(values)
            };            
            this.messages.push(message);
            this.console(message);
        }

        /**
         * Exibe a mensagem no console.
         * @param {Message} message Mensagem de log.
         */
        private console(message: Message): void {
            if (!this.isDebug) return;

            console.log(`[${Level[message.level]}]`, message.text);
        }
    }
}
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

            for (let i = 0; i < 1000; i++) console.log(i % 2 ? " " : "  ");
            console.log("%cluckygames.tips", "font-size: 36px; color: #28a745; font-weight: bold;");
            console.log("%cWay to do much more. Thanks for the support.", "font-size: 20px; color: #007bff; font-weight: bold;");
            for (let i = 0; i < 1; i++) console.log(i % 2 ? " " : "  ");

            instance.post("Log iniciado.", null, Core.Log.Level.Debug);
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
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {Level} level Nível da mensagem.
         * @param {any} toConsoleLog Qualquer coisas para ser passado como parâmetro para console.log();
         */
        public post(text: string, values: any = { }, level: Level, toConsoleLog: any = undefined): void {
            const message: Message = {
                time: new Date(),
                level: level,
                text: text.querystring(values)
            };            
            this.messages.push(message);
            this.console(message, toConsoleLog);
        }

        /**
         * Exibe a mensagem no console.
         * @param {Message} message Mensagem de log.
         * @param {any} toConsoleLog Qualquer coisas para ser passado como parâmetro para console.log();
         */
        private console(message: Message, toConsoleLog: any = undefined): void {
            if (!this.isDebug) return;

            if (toConsoleLog !== undefined) console.log(`[${Level[message.level]}]`, message.text, toConsoleLog);
            else console.log(`[${Level[message.level]}]`, message.text);
        }
    }
}
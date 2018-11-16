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
         * Define uma instância de log para uso global no sistema.
         * Só pode ser definido uma vez.
         * @param instance Instância global.
         */
        public  static setInstance(instance: History): void {
            if (this.instance) throw new Error("A instância global de log não pode ser redefinida.");
            this.instance = instance;
        }

        /**
         * Retorna a instância de uso global para log.
         * @returns {History} Instância para log.
         */
        public static getInstance(): History {
            if (!this.instance) throw new Error("A instância global de log ainda não foi definida.");
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
         */
        public post(text: string, level: Level): void {
            const message: Message = {
                time: new Date(),
                level: level,
                text: text
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
namespace Skript.Core.Log {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Manipula e registra mensagens de log.
     */
    export class History {

        /**
         * Construtor.
         */
        public constructor() {
            skript.log = skript.log ? skript.log : this;
            new HistoryBus(this);
        }

        /**
         * Lista de mensagens de log.
         * @type {Message[]}
         */
        private allMessages: Message[] = [];

        /**
         * Retorna uma cópia de todas as mensagens.
         */
        public messages(): Message[] { return this.allMessages.slice() }

        /**
         * Monta um objeto de mensagem de log.
         * @param {string} message Mensagem.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {Level} level Nível da mensagem.
         */
        public mountMessage(text: string, values: any = { }, level: Level = Level.Information): Message {
            try {
                text = skript.translate.get(text, values);
            } catch (e) {
                text = text.querystring(values)
            }
            const message: Message = {
                id: Util.Numeric.random(),
                time: new Date(),
                level: level,
                text: text
            };            
            return message;
        }

        /**
         * Limpa todas as mensagens do log.
         */
        public clear(): void {
            this.allMessages.length = 0;
            new Core.Message.LogMessageCleared().sendAsync();
            this.post("The log message list has been cleared.", null, Level.Information);
        }

        /**
         * Registra uma mensagem de log
         * @param {string} message Mensagem.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {Level} level Nível da mensagem.
         * @param {any} toConsoleLog Opcional. Qualquer coisas para ser passado como parâmetro para console.log
         * @param {boolean} cancelLogMessagePosted Opcional. Usado para evitar mensagem pelo MessageBus. Usado para evitar recursividade infinita.
         */
        public post(text: string, values: any = { }, level: Level = Level.Information, toConsoleLog: any = undefined, skipLogMessagePosted: boolean = false): void {
            if (!skript.configuration.debug &&
                level != Core.Log.Level.Information &&
                level != Core.Log.Level.Warning &&
                level != Core.Log.Level.Error &&
                level != Core.Log.Level.Debug) return;
                    
            const message = this.mountMessage(text, values, level);
            
            this.allMessages.push(message);

            if (!skipLogMessagePosted) new Core.Message.LogMessagePosted(message).sendAsync();
            
            ConsoleLog.write(message, level, toConsoleLog);
        }
    }
}
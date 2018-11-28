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
         * Registra uma mensagem de log
         * @param {string} message Mensagem.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {Level} level Nível da mensagem.
         * @param {any} toConsoleLog Qualquer coisas para ser passado como parâmetro para console.log
         */
        public post(text: string, values: any = { }, level: Level = Level.Information, toConsoleLog: any = undefined): void {
            try {
                text = skript.translate.get(text, values);
            } catch (e) {
                text = text.querystring(values)
            }
            const message: Message = {
                time: new Date(),
                level: level,
                text: text
            };            
            this.allMessages.push(message);

            new Core.Message.LogMessagePosted(message).sendAsync();
            
            ConsoleLog.write(message, level, toConsoleLog);
        }
    }
}
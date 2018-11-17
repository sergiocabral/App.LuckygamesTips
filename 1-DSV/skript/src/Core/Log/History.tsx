namespace Core.Log {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const all: Core.All;

    /**
     * Manipula e registra mensagens de log.
     */
    export class History {

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
            try {
                text = all.translate.get(text, values);
            } catch (e) {
                text = text.querystring(values)
            }
            const message: Message = {
                time: new Date(),
                level: level,
                text: text
            };            
            this.messages.push(message);
            ConsoleLog.write(message, level, toConsoleLog);
        }
    }
}
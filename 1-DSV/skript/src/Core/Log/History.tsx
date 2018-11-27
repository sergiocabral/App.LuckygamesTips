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
        }

        /**
         * Lista de mensagens de log.
         * @type {Message[]}
         */
        private messages: Message[] = [];
        
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
            this.messages.push(message);
            
            if (skript.presentation) skript.presentation.message(message);
            
            ConsoleLog.write(message, level, toConsoleLog);
        }
    }
}
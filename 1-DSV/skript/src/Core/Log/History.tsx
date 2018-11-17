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
         * Exibe no console.log() uma mensagem de boas vondas ao usuário.
         */
        public static welcome(title: string, message: string): void {
            for (let i = 0; i < 1000; i++) console.log(i % 2 ? " " : "  ");
            console.log(`%c${title}`, "font-size: 36px; color: #28a745; font-weight: bold;");
            console.log(`%c${message}`, "font-size: 20px; color: #007bff; font-weight: bold;");
            for (let i = 0; i < 1; i++) console.log(i % 2 ? " " : "  ");
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
            this.console(message, level, toConsoleLog);
        }

        /**
         * Exibe a mensagem no console.
         * @param {Message} message Mensagem de log.
         * @param {any} toConsoleLog Qualquer coisas para ser passado como parâmetro para console.log();
         */
        private console(message: Message, level: Level, toConsoleLog: any = undefined): void {
            if (!this.isDebug) return;

            const style = 
                level === Level.Debug ? "color: #6c757d;" :
                level === Level.Warning ? "color: #ffc107; font-weight: bold;" :
                level === Level.Error ? "color: #dc3545; font-weight: bold;" :
                "color: #007bff;";

            if (toConsoleLog !== undefined) console.log(`%c[${Level[message.level]}] ${message.text}`, style, toConsoleLog);
            else console.log(`%c[${Level[message.level]}] ${message.text}`, style);
        }
    }
}
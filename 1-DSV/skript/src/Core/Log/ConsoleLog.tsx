namespace Core.Log {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const tips: Core.All;
    
    /**
     * Manipula e registra mensagens de log.
     */
    export class ConsoleLog {

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
         * Exibe a mensagem no console.
         * @param {Message} message Mensagem de log.
         * @param {any} toConsoleLog Qualquer coisas para ser passado como parâmetro para console.log();
         */
        public static write(message: Message, level: Level, toConsoleLog: any = undefined): void {
            if (!tips.configuration.debug) return;

            const style = this.getStyle(level);

            if (toConsoleLog !== undefined) console.log(`%c[${Level[message.level]}] ${message.text}`, style, toConsoleLog);
            else console.log(`%c[${Level[message.level]}] ${message.text}`, style);
        }

        /**
         * Retorna o código de style para exibição do console.log() para cada nível de log.
         * @param {Level} level Nível do log.
         */
        private static getStyle(level: Level) {
            switch (level) {
                case Level.Debug: return "color: #6c757d;";
                case Level.Warning: return "color: #ffc107; font-weight: bold;";
                case Level.Error: return "color: #dc3545; font-weight: bold;";
                default: return "color: #007bff;";
            }
        }
    }
}
namespace Core {

    /**
     * Níveis de log.
     */
    export enum LogLevel { 
        
        /**
         * Informações de depuração.
         */
        Debug 
    }

    /**
     * Manipula e exibe mensagens do sistema.
     */
    export class Messages {
        
        /**
         * Registra uma mensagem de log
         * @param  {string} msg Mensagem.
         * @param  {LogLevel} level Nível do log.
         * @returns void
         */
        public static log(msg: string, level: LogLevel): void {
            if (level === LogLevel.Debug && Main.initializeConfig.debug) {
                console.log(`[${LogLevel[level]}] ${msg}`);
            }
        }
    }
}
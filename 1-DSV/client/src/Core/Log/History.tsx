namespace Core.Log {

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
         * @param {Level} level Nível da mensagem.
         */
        public post(text: string, level: Level): void {
            const message: Message = {
                time: new Date(),
                level: level,
                text: text
            };
            this.messages.push(message);
        }
    }
}
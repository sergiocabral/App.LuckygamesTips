namespace Skript.Core.Message {

    /**
     * Uma mensagem foi postada no log.
     */
    export class LogMessagePosted extends Core.Bus.Message { 

        /**
         * Quando true não posta no log ações dessa mensagem.
         * @type {boolean}
         */
        public skipLogMessagePosted: boolean = true;

        /**
         * Construtor.
         * @param {Core.Log.Message} message Mensagem de log.
         */
        public constructor(message: Core.Log.Message) {
            super();
            this.message = message;
        }

        /**
         * Mensagem de log.
         * @type {Core.Log.Message}
         */
        public message: Core.Log.Message;
   }
}
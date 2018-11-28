namespace Skript.Core.Message {

    /**
     * Solicita as mensagens no log atualmente.
     */
    export class GetLogMessages extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {Core.Log.Message} message Mensagem de log.
         */
        public constructor() {
            super();
            this.messages = [];
        }

        /**
         * Mensagem de log.
         * @type {Core.Log.Message[]}
         */
        public messages: Core.Log.Message[];
   }
}
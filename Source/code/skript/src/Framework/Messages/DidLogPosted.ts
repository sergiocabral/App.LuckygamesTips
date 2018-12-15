namespace Skript.Framework.Messages {

    /**
     * Ao se posta uma mensagem no log.
     */
    export class DidLogPosted extends Bus.Message { 

        /**
         * Construtor.
         * @param {string} log Mensagem de log.
         */
        public constructor(public log: Log.Message) {
            super();
        }
    }
}
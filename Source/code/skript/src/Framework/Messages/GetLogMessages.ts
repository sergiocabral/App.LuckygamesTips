namespace Skript.Framework.Messages {

    /**
     * Lista atual de mensagens de log.
     */
    export class GetLogMessages extends Bus.Message {

        /**
         * Mensagens.
         * @type {Log.Message[]}
         */
        public messages?: Log.Message[];
    }
}
namespace Skript.Core.Message {

    /**
     * Solicita as mensagens no log atualmente.
     */
    export class GetLogMessages extends Core.Bus.Message { 

        /**
         * Resultados
         */
        public result?: { 

            /**
             * Mensagem de log.
             * @type {Core.Log.Message[]}
             */
            messages: Core.Log.Message[]
        }
   }
}
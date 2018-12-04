namespace Skript.Automation.Message {

    /**
     * Retorna as definições atuais.
     */
    export class GetCurrentSettings extends Core.Bus.Message { 

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Definições.
             * @type {Object}
             */
            settings: Object 
        }
    }
}
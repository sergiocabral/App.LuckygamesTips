namespace Skript.Automation.Message {

    /**
     * Retorna as definições padrão.
     */
    export class GetDefaultSettings extends Core.Bus.Message { 

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
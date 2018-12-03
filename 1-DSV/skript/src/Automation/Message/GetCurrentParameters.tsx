namespace Skript.Automation.Message {

    /**
     * Retorna os parâmetros atuais.
     */
    export class GetCurrentParameters extends Core.Bus.Message { 

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Parâmetros como json.
             * @type {Object}
             */
            parameters: Object 
        }
    }
}
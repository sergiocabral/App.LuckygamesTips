namespace Skript.Automation.Message {

    /**
     * Retorna todos os parâmetros ou busca por nome.
     */
    export class GetSavedParameters extends Core.Bus.Message { 

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Lista de parâmetros encontrados.
             * @type {{[name: string]: Object}}
             */
            parameters: {[name: string]: Object} ;
        }
    }
}
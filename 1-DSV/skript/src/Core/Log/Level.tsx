namespace Skript.Core.Log {

    /**
     * Níveis de log.
     */
    export enum Level { 
                
        /**
         * Informações em geral.
         */
        Information,

        /**
         * Pontos de atenção.
         */
        Warning,

        /**
         * Erro de sistema.
         */
        Error,
        
        /**
         * Informações de depuração.
         */
        Debug,
    
            /**
         * Informações de depuração do Bus.
         */
        DebugBus,
        
        /**
         * Informações de depuração relacionadas ao DOM.
         */
        DebugDOM,
        
        /**
         * Informações de depuração do React.
         */
        DebugReact,
        
        /**
         * Informações de depuração da request HTTP.
         */
        DebugRequest
    }
}
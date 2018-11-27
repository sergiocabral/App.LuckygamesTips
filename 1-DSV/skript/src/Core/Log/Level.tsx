namespace Skript.Core.Log {

    /**
     * Níveis de log.
     */
    export enum Level { 
        
        /**
         * Informações de depuração do React.
         */
        DebugReact,
        
        /**
         * Informações de depuração do Bus.
         */
        DebugBus,
        
        /**
         * Informações de depuração da request HTTP.
         */
        DebugRequest,
        
        /**
         * Informações de depuração.
         */
        Debug,
        
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
        Error
    }
}
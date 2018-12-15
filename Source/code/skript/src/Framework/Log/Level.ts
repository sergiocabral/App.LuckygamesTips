namespace Skript.Framework.Log {

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
         * Erros de sistema.
         */
        Error,
        
        /**
         * Informações de depuração.
         */
        Debug,

        /**
         * Informações detalahadas sobre o funcionamento do sistema.
         */
        Verbose,

        /**
         * Informações postada apenas no console, mas não entra no log.
         */
        Console,
    }
}
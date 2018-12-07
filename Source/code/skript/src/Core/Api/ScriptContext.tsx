namespace Skript.Core.Api {

    /**
     * Contextos de script para carregamento do servidor.
     */
    export enum ScriptContext { 
        
        /**
         * Implementação do React
         */
        React,

        /**
         * Módulos necessários ao funcionamento do sistema.
         */
        SystemPart,

        /**
         * Módulos livre para uso geral.
         */
        FreePart,

        /**
         * Módulos licenciados
         */
        PaidPart
    }
}
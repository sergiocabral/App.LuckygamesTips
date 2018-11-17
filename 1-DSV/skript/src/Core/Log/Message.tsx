namespace Core.Log {

    /**
     * Mensagem de log
     */
    export type Message = { 
        
        /**
         * Momento do log.
         * @type {Date}
         */
        time: Date,

        /**
         * Nível do log.
         * @type {Level}
         */
        level: Level,

        /**
         * Texto.
         * @type {string}
         */
        text: string        
    }
}
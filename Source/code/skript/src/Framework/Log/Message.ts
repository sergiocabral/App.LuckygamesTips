namespace Skript.Framework.Log {

    /**
     * Mensagem de log.
     */
    export type Message = { 
        
        /**
         * Identificador.
         * @type {number}
         */
        id: number,

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
         * Orígem do log.
         * @type {string}
         */
        origin: string,

        /**
         * Texto.
         * @type {string}
         */
        text: string        
    }
}
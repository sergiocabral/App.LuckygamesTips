namespace Skript.Business.Core {

    /**
     * Dados para inicialização do sistema.
     */
    export type MainConfiguration = {

        /**
         * Endereço do servidor.
         * @type {string}
         */
        server: string,

        /**
         * Força o modo debug.
         */
        debug?: boolean
    }
}
namespace Core {

    /**
     * Conjunto de propriedades que configuram o sistema.
     */
    export type Configuration = {

        /**
         * Nome do sistema
         * @type {string}
         */
        name: string

        /**
         * Indica se a execução está em modo DEBUG.
         * @type {boolean}
         */
        debug: boolean,

        /**
         * Url da api no servidor.
         * @type {string}
         */
        server: string
    }
}
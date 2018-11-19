namespace Skript.Core {

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
         * Indica se deve exibir a mensagem de boas vindas ao usuário.
         * @type {boolean}
         */
        welcome: boolean,

        /**
         * Url da api no servidor.
         * @type {string}
         */
        server: string
    }
}
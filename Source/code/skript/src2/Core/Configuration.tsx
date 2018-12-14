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
         * Indica se a execução está em modo DEBUG. Se não informado determinar automaticamente.
         * @type {boolean}
         */
        debug?: boolean,

        /**
         * Indica se deve ou não exibir a mensagem de boas vindas ao usuário.
         * @type {boolean}
         */
        noWelcomeMessage?: boolean,

        /**
         * Url do servidor.
         * @type {string}
         */
        server: string
    }
}
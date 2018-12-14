namespace Skript.Framework.Request {

    /**
     * Configuração inicial do manipulador de chamadas api.
     */
    export type ApiConfiguration = {

        /**
         * Url do servidor para recebimentos de dados JSON.
         * @type {string}
         */
        urlData: string,

        /**
         * Url do servidor para recebimentos de conteúdo javascript.
         * @type {string}
         */
        urlScript: string,
    }
}
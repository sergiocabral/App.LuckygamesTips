namespace Skript.Framework.Types {

    /**
     * Ação
     */
    export type Action = {

        /**
         * Nome do parâmetro.
         * @returns {string}
         */
        name: string,

        /**
         * Função para execução.
         * @returns {() => void}
         */
        execute: () => void,
    }
}
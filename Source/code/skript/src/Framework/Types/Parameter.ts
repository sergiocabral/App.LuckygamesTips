namespace Skript.Framework.Types {

    /**
     * Parâmetro
     */
    export type Parameter<T> = {

        /**
         * Nome do parâmetro.
         * @returns {string}
         */
        name: string,

        /**
         * Função para leitura.
         * @returns {() => T}
         */
        get: () => T,

        /**
         * Função para definição. Retorna false se não foi definido.
         * @returns {(value: T) => boolean}
         */
        set: (value: T) => boolean
    }
}
namespace Skript.Core {
    
    /**
     * Tipo para dimensão.
     */
    export type Size = {

        /**
         * Largura.
         * @type {number}
         */
        width: number,

        /**
         * Altura.
         * @type {number}
         */
        height: number
    }

    /**
     * Posicionamento
     */
    export type Position = { 

        /**
         * Posição horizontal.
         * @type {number}
         */
        x: number, 

        /**
         * Posição vertical.
         * @type {number}
         */
        y: number
    }

    /**
     * Estado de aberto e fechado.
     */
    export enum OpenClose {

        /**
         * Fechado.
         */
        Close,

        /**
         * Aberto.
         */
        Open
    }

    /**
     * Conjunto de chave e valor.
     */
    export type KeyValue<T> = { [key: string]: T }
}

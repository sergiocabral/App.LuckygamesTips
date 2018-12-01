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
    export enum CloseOpen {

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
     * Estado de desligado e ligado
     */
    export enum OffOn {

        /**
         * Desligado.
         */
        Off,

        /**
         * Ligado
         */
        On
    }

    /**
     * Conjunto de chave e valor.
     */
    export type KeyValue<T, U = any> = { 

        /**
         * Chave.
         * @type {string}
         */
        key: string,

        /**
         * Valor.
         * @type {T}
         */
        value: T,
        
        /**
         * Informação extra vinculada
         * @type {U}
         */
        state?: U
    }
}

namespace Skript.Framework.Types {

    /**
     * Par de chave e valor.
     */
    export type KeyValue<TValue = string, TState = any, TKey = string> = {

        /**
         * Chave.
         * @type {TKey}
         */
        key: TKey,

        /**
         * Valor.
         * @type {TValue}
         */
        value: TValue,
        
        /**
         * Informação extra vinculada
         * @type {TState}
         */
        state?: TState,
    }
}
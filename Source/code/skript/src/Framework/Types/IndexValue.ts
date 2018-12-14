namespace Skript.Framework.Types {

    /**
     * Par de chave e valor através de índice.
     */
    export type IndexValue<TValue = string, TState = any> = {

        [index: string]: {

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
}
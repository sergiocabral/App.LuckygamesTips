namespace Skript.Framework.Types {

    /**
     * Par de chave e valor através de índice.
     */
    export type Index<T = string> = {

        /**
         * Assinatura Index.
         */
        [index: string]: T 
    }
}
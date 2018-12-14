namespace Skript.Framework.Layout.Dialog {

    /**
     * Valor de entrada numa janela Dialog.
     */
    export type Input = {

        /**
         * Valor inicial.
         * @type {string}
         */
        defaults?: string,

        /**
         * Função validadora.
         * @type {(value: string) => boolean}
         */
        validate?: (value: string) => boolean
    }
}
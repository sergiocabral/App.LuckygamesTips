namespace Skript.Framework.Layout.Dialog {

    /**
     * Conjunto retornado após fechar uma janela Dialog.
     */
    export type Result<TInput = string> = {
        
        /**
         * Botão acionado.
         * @type {Button}
         */
        button: Button,

        /**
         * Valor de entrada.
         * @type {TInput}
         */
        input?: TInput
    }
}
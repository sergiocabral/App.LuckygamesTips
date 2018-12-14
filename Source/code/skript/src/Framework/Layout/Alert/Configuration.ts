namespace Skript.Framework.Layout.Dialog {

    /**
     * Propriedades dos botões em uma mensagem de diálogo ao usuário.
     */
    export type Configuration = {

        /**
         * Texto.
         * @type {string}
         */
        text: string,

        /**
         * Título.
         * @type {string}
         */
        title?: string,
        
        /**
         * Botões.
         * @type {Button[]}
         */
        buttons: Button[],

        /**
         * Tipo.
         * @type {Type}
         */
        type?: Type,

        /**
         * Valor de entrada do usuário.
         * @type {Input}
         */
        input?: Input,
    }
}
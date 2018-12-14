namespace Skript.Framework.Layout.Dialog {

    /**
     * Tipo para botões de Dialog.
     */
    export type Button<TData = any> = {
        
        /**
         * Texto de exibição.
         * @type {string}
         */
        text?: string,
        
        /**
         * Class css para ícone <i class="?"></i>
         * @type {string}
         */
        icon?: string,

        /**
         * Classe CSS
         * @type {string}
         */
        className?: string,

        /**
         * Sinaliza que deve receber foco ou ser acionado com a tecla ENTER.
         * @type {boolean}
         */
        focus?: boolean,

        /**
         * Sinaliza que deve ser acionado com a tecla ESC.
         * @type {boolean}
         */
        escape?: boolean,

        /**
         * Qualquer dado associado.
         * @type {TData}
         */
        data?: TData
    }
}
namespace Skript.Framework.Layout.Components {

    /**
     * Visibility: Configuração de inicialização.
     */
    export type VisibilityConfiguration = {

        /**
         * Elemento.
         * @type {HTMLElement}
         */
        element: HTMLElement,

         /**
          * Indica se o elemento deve começar visível.
          * @type {boolean}
          */
        show?: boolean,

        /**
         * Tempo em segundo da transição.
         * @type {number}
         */
        fade?: number,

        /**
         * Opacidade quando o elemento está invisível.
         */
        opacityHidden?: number,

        /**
         * Opacidade quando o elemento está visível.
         */
        opacityVisible?: number,

        /**
         * Opacidade quando o elemento está com o mouse sobre.
         */
        opacityHover?: number,
    }
}

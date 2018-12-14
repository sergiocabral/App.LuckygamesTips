namespace Skript.Framework.Layout.Components.DialogHeader {

    /**
     * Props padrão para este componentes React.
     */
    export class Props extends EmptyProps {

        /**
         * Título.
         * @type {string}
         */
        title?: string;

        /**
         * Ícone. Opcional.
         * @type {string}
         */
        icon?: string;

        /**
         * Indica se deve haver opção de colapsar.
         * @type {boolean}
         */
        collapsible?: boolean;

        /**
         * Indica se deve haver opção de janela de diálogo
         * @type {boolean}
         */
        dialog?: boolean;

        /**
         * Dimensão padrão da janela se estiver habilitada.
         * @type {Types.Size|undefined}
         */
        dialogSize?: Types.Size;

        /**
         * Posição padrão da janela se estiver habilitada.
         * @type {Types.Position|undefined}
         */
        dialogPosition?: Types.Position;

        /**
         * Função chamada sempre que redimensionar.
         * @type {() => void}
         */
        onResize?: () => void;
    }
}

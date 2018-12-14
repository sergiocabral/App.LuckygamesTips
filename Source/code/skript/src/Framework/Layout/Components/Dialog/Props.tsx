namespace Skript.Framework.Layout.Components.Dialog {

    /**
     * Props padrão para este componentes React.
     */
    export class Props extends EmptyProps {

        /**
         * Título da janela.
         * @type {string}
         */
        title: string = "Dialog title here";

        /**
         * Ícone da janela. Formato FontAwesome.
         * @type {string}
         */
        icon?: string;

        /**
         * Modo de fechamento da janela.
         * @type {CloseMode}
         */
        closeMode: CloseMode = CloseMode.Hide;

        /**
         * Dimensão.
         * @type {Types.Size}
         */
        size?: Types.Size;

        /**
         * Posição.
         * @type {Types.Position}
         */
        position?: Types.Position;

        /**
         * Função chamada sempre que redimensionar.
         * @type {() => void}
         */
        onResize?: () => void;
    }
}

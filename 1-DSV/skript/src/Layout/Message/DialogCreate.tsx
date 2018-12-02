namespace Skript.Layout.Message {

    /**
     * Criar uma nova janela de diálogo.
     */
    export class DialogCreate extends Core.Bus.Message {

        /**
         * Construtor.
         * @param {string} title Título na barra.
         * @param {string} icon Ícone no formato FontAwesome.
         * @param {ReactJs.Component.DialogCloseMode} closeMode Modos de fechamento da janela.
         * @param {any} children Opcional. Conteúdo da janela.
         * @param {string} className Classes CSS.
         * @param {Core.Size} size Opcional. Dimensão.
         */
        public constructor(
            title: string, 
            closeMode: ReactJs.Component.DialogCloseMode, 
            icon?: string, 
            children?: any, 
            className?: string,
            size?: Core.Size,
            position?: Core.Position) { 

            super();
            
            this.title = title;
            this.closeMode = closeMode;            
            this.icon = icon;
            this.className = className;
            this.children = children;
            this.size = size;
            this.position = position;
        }

        /**
         * Título na barra.
         * @type {string}
         */
        public title: string;

        /**
         * Modos de fechamento da janela.
         * @type {ReactJs.Component.DialogCloseMode}
         */
        public closeMode: ReactJs.Component.DialogCloseMode;

        /**
         * Ícone.
         * @type {string}
         */
        public icon?: string;

        /**
         * Classes CSS..
         * @type {string}
         */
        public className?: string;

        /**
         * Conteúdo da janela.
         * @type {any}
         */
        public children?: any;

        /**
         * Dimensão
         * @type {Core.Size}
         */
        public size?: Core.Size;

        /**
         * Posição
         * @type {Core.Position}
         */
        public position?: Core.Position;

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Janela base que contem outros componentes.
             * @type {ReactJs.Component.Dialog}
             */
            dialog: ReactJs.Component.Dialog 
        }
    }
}
namespace Skript.Layout.Message {

    /**
     * Criar uma nova janela de diálogo.
     */
    export class DialogCreate extends Core.Bus.Message {

        /**
         * Construtor.
         * @param {string} title Título na barra.
         * @param {ReactJs.Component.DialogCloseMode} closeMode Modos de fechamento da janela.
         * @param {any} children Opcional. Conteúdo da janela.
         * @param {number} width Opcional. Largura.
         * @param {number} height Opcional. Altura.
         */
        public constructor(title: string, closeMode: ReactJs.Component.DialogCloseMode, children?: any, width?: number, height?: number) { 
            super();
            this.title = title;
            this.closeMode = closeMode;
            this.children = children;
            this.width = width;
            this.height = height;
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
         * Conteúdo da janela.
         * @type {any}
         */
        public children?: any;

        /**
         * Largura
         * @type {number}
         */
        public width?: number;

        /**
         * Altura
         * @type {number}
         */
        public height?: number;
    }
}
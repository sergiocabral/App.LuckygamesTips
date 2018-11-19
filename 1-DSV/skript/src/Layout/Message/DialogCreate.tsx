namespace Skript.Layout.Message {

    /**
     * Criar uma nova janela de diálogo.
     */
    export class DialogCreate extends Core.Bus.Message {

        /**
         * Construtor.
         * @param {string} title Título na barra.
         * @param {ReactJs.Component.DialogCloseMode} closeMode Modos de fechamento da janela.
         * @param {any} children Conteúdo da janela.
         */
        public constructor(title: string, closeMode: ReactJs.Component.DialogCloseMode, children?: any) { 
            super();
            this.title = title;
            this.closeMode = closeMode;
            this.children = children;
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
    }
}
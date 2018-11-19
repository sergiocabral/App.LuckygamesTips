namespace Skript.Layout.Message {

    /**
     * Criar uma nova janela de diálogo.
     */
    export class DialogCreate extends Core.Bus.Message {

        /**
         * Construtor.
         * @param {string} title Título na barra.
         * @param {any} children Conteúdo da janela.
         */
        public constructor(title: string, children?: any) { 
            super();
            this.title = title;
            this.children = children;
        }

        /**
         * Título na barra.
         * @type {string}
         */
        public title: string;

        /**
         * Conteúdo da janela.
         * @type {any}
         */
        public children?: any;
    }
}
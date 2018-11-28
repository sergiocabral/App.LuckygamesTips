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
         * @param {Core.Size} size Opcional. Dimensão.
         */
        public constructor(
            title: string, 
            closeMode: ReactJs.Component.DialogCloseMode, 
            icon?: string, 
            children?: any, 
            size?: Core.Size) { 

            super();
            
            this.title = title;
            this.closeMode = closeMode;            
            this.icon = icon;
            this.children = children;
            this.size = size;
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
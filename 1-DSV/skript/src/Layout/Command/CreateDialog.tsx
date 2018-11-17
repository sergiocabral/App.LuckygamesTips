namespace Layout.Command {

    /**
     * Evento ao criar uma nova janela de diálogo.
     */
    export class CreateDialog extends Core.Bus.Command {

        /**
         * Construtor.
         * @param {string} title Título na barra.
         */
        public constructor(title: string) { 
            super();
            this.title = title;
        }

        /**
         * Título na barra.
         * @type {string}
         */
        public title: string;
    }
}
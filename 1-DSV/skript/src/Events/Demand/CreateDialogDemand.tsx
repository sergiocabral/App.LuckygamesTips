namespace Events.Demand {

    /**
     * Evento ao criar uma nova janela de diálogo.
     */
    export class CreateDialogDemand extends Event {

        /**
         * Construtor.
         * @param {string} title Título na barra.
         */
        public constructor(title: string) { 
            super(Type.Demand); 
            this.title = title;
        }

        /**
         * Título na barra.
         * @type {string}
         */
        public title: string;
    }
}
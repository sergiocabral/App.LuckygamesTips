namespace Layout.Events {

    /**
     * Evento ao criar uma nova janela de diálogo.
     */
    export class DemandCreateDialog extends Core.Events.Event {

        /**
         * Construtor.
         * @param {string} title Título na barra.
         */
        public constructor(title: string) { 
            super(Core.Events.Type.Demand); 
            this.title = title;
        }

        /**
         * Título na barra.
         * @type {string}
         */
        public title: string;
    }
}
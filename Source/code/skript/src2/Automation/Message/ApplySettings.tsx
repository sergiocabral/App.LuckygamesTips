namespace Skript.Automation.Message {

    /**
     * Aplica as definições nos módulos.
     */
    export class ApplySettings extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {Object} settings Definições.
         */
        public constructor(settings: Object) {
            super();
            this.settings = settings;
        }

        /**
         * Definições.
         * @type {Object}
         */
        public settings: Object;

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Messagens de erro se houver
             * @type {string}
             */
            errors?: string[]
        }
    }
}
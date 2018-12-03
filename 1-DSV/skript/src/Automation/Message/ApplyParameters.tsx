namespace Skript.Automation.Message {

    /**
     * Aplica parâmetros nos módulos.
     */
    export class ApplyParameters extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {Object} parameters Parâmetros como json.
         */
        public constructor(parameters: Object) {
            super();
            this.parameters = parameters;
        }

        /**
         * Parâmetros como json.
         * @type {Object}
         */
        public parameters: Object;
    }
}
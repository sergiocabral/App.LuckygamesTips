namespace Skript.Automation.Message {

    /**
     * Grava definições em um parâmetro
     */
    export class SaveSettingsToParameter extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {string} name Nome
         * @param {Object} parameters Parâmetros como json.
         */
        public constructor(name: string, parameters: Object) {
            super();
            this.name = name;
            this.parameters = parameters;
        }

        /**
         * Nome.
         * @type {string}
         */
        public name?: string;

        /**
         * Parâmetros como json.
         * @type {Object}
         */
        public parameters?: Object;
    }
}
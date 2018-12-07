namespace Skript.Automation.Message {

    /**
     * Grava definições em um parâmetro
     */
    export class SaveSettingsToParameter extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {string} name Nome
         * @param {Object} settings Parâmetros como json.
         */
        public constructor(name: string, settings: Object) {
            super();
            this.name = name;
            this.settings = settings;
        }

        /**
         * Nome.
         * @type {string}
         */
        public name: string;

        /**
         * Parâmetros como json.
         * @type {Object}
         */
        public settings: Object;
    }
}
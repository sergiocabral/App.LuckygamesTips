namespace Skript.Automation.Message {

    /**
     * Apaga um parâmetro por nome.
     */
    export class DeleteParameter extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {string} name Opcional. Nome
         */
        public constructor(name: string) {
            super();
            this.name = name;
        }

        /**
         * Nome.
         * @type {string}
         */
        public name: string;
    }
}
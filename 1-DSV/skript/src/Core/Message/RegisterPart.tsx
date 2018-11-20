namespace Skript.Core.Message {

    /**
     * Registra um módulo.
     */
    export class RegisterPart extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {PartBase} part Parte.
         */
        public constructor(part: Part.PartBase) {
            super();
            this.part = part;
        }

        /**
         * Parte.
         * @type {PartBase}
         */
        public part: Part.PartBase;
    }
}
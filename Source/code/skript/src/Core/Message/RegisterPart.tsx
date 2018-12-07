namespace Skript.Core.Message {

    /**
     * Registra um módulo.
     */
    export class RegisterPart extends Core.Bus.Message {
        
        /**
         * Construtor.
         * @param {Part.Part} part Parte.
         */
        public constructor(part: Part.Part) {
            super();
            this.part = part;
        }

        /**
         * Parte.
         * @type {Part.Part}
         */
        public part: Part.Part;

        /**
         * Resultados
         */
        public result?: { 

            /**
             * Conjunto de ferramentas para uso do módulo.
             * @type {Part.Tools}
             */
            tools: Part.Tools 
        }
    }
}
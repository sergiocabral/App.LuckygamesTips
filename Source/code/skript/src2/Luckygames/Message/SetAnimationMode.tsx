namespace Skript.Luckygames.Message {

    /**
     * Define o modo das animaçõesdo site da luckygames.io.
     */
    export class SetAnimationMode extends Core.Bus.Message {

        /**
         * Construtor.
         * @param {Core.OffOn} mode Modo.
         */
        public constructor(mode: Core.OffOn) {
            super();
            this.mode = mode;
        }

        /**
         * Modo.
         * @type {Core.OffOn}
         */
        public mode: Core.OffOn; 

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Estado definido
             * @type {Core.OffOn}
             */
            mode: Core.OffOn 
        }
    }
}
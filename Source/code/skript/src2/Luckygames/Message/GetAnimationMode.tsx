namespace Skript.Luckygames.Message {

    /**
     * Retorna o modo do tema da luckygames.io.
     */
    export class GetAnimationMode extends Core.Bus.Message {

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Estado atual
             * @type {Core.OffOn}
             */
            mode: Core.OffOn 
        }
    }
}
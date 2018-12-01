namespace Skript.Luckygames.Message {

    /**
     * Define o modo do WebSocket da luckygames.io.
     */
    export class SetWebSocketMode extends Core.Bus.Message {

        /**
         * Construtor.
         * @param {WebSocketMode} mode Modo.
         */
        public constructor(mode: WebSocketMode) {
            super();
            this.mode = mode;
        }

        /**
         * Modo.
         * @type {WebSocketMode}
         */
        public mode: WebSocketMode; 

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Estado definido
             * @type {WebSocketMode}
             */
            mode: WebSocketMode 
        }
    }
}
namespace Skript.Luckygames.Message {

    /**
     * Retorna o modo do WebSocket da luckygames.io.
     */
    export class GetWebSocketMode extends Core.Bus.Message {

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Estado atual
             * @type {WebSocketMode}
             */
            mode: WebSocketMode 
        }
    }
}
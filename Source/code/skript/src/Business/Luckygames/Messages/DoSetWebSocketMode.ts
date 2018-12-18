namespace Skript.Business.Luckygames.Messages {

    /**
     * Definir modo do WebSocket
     */
    export class DoSetWebSocketMode extends Framework.Bus.Message {
        
        /**
         * Constructor.
         * @param {WebSocketMode} mode Modo
         */
        public constructor(public mode: WebSocketMode) { 
            super();
        }
    }
}
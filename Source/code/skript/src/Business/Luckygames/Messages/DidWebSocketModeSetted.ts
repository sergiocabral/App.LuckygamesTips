namespace Skript.Business.Luckygames.Messages {

    /**
     * Definido modo do WebSocket
     */
    export class DidWebSocketModeSetted extends Framework.Bus.Message {
        
        /**
         * Constructor.
         * @param {WebSocketMode} mode Modo
         */
        public constructor(public mode: WebSocketMode) { 
            super();
        }
    }
}
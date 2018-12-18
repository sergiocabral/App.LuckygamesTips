namespace Skript.Business.Luckygames.Messages {

    /**
     * Retorna o valor definido para WebSocket.
     */
    export class GetWebSocketMode extends Framework.Bus.Message {
        
        /**
         * Modo.
         * @type {ThemeMode}
         */
        public mode?: WebSocketMode;
    }
}
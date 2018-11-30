namespace Skript.Luckygames {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Controlador do websocket da luckygames.io
     */
    export class WebSocketControl {

        /**
         * Inicializa o controle do WebSocket.
         * @param {boolean} tryAgain Opcional. Indica quantas tentativas por segundo.
         * @returns {Promise<boolean>} Retorna true quando há sucesso.
         */
        public static initialize(tryAgain: number = 0): Promise<boolean> {
            return new Promise(resolve => {
                const check = (tryAgain: number) => {
                    skript.log.post("Trying to intercept WebSocket.", null, Core.Log.Level.DebugLuckygames);

                    const ws = WebSocketControl.websocket();
                    if (tryAgain > 0 && !ws) setTimeout(() => check(--tryAgain), 1000);
                    else {
                        if (ws && ws.constructor.name !== WebSocket.name) throw new Core.Errors.InvalidArgument(`Luckygames.io WebSocket type: ${ws.constructor.name} == ${WebSocket.name}`);

                        const result = !!ws;

                        if (result) {
                            WebSocketControl.currentMode = WebSocketMode.Normal;
                            skript.log.post("WebSocket successfully intercepted.", null, Core.Log.Level.DebugLuckygames, ws);
                        }
                        else {
                            WebSocketControl.currentMode = undefined;
                            skript.log.post("Could not adjust WebSockets operation of luckygames.io.", null, Core.Log.Level.Warning);
                        }

                        resolve(result);
                    }
                };
                check(tryAgain);
            });
        }
        
        /**
         * Instância do websocket da luckygames.io
         * @returns {WebSocket} Instância original, mas adaptada, do websockets da luckygames.io
         */
        private static websocket(): WebSocket|undefined {
            const socket = (window as any).socket;
            const ws = socket && socket.id ? socket.id : undefined;
            if (socket && ws) WebSocketControl.intercept(socket);
            return ws;
        }
                
        /**
         * Configura a interceptação do WebSocket da luckygames.io
         * @param {any} socket Parâmetros do WebSocket
         */
        private static intercept(socket: any): void {
            if (!socket || socket.intercepted) return;
            WebSocketControl.socketReconnectBackup = socket.Reconnect;
            socket.Reconnect = WebSocketControl.socketReconnectNew;
            socket.intercepted = true;
        }

        /**
         * Reconnect original.
         */
        private static socketReconnectBackup?: () => any;

        /**
         * Interceptação do Reconnect original.
         * @param {any} param A análise de parâmetros determina se a chamada é externa ou interna.
         */
        private static socketReconnectNew(param?: any): any {
            if (!WebSocketControl.socketReconnectBackup) throw new Core.Errors.NullNotExpected("WebSocketControl.socketReconnectBackup");

            const mode = WebSocketControl.mode()            
            switch (mode) {
                case WebSocketMode.Normal: 
                    skript.log.post("Request to reconnect WebSocket was accepted. Current interceptor mode: {0}", WebSocketMode[mode], Core.Log.Level.DebugLuckygames, param);
                    return WebSocketControl.socketReconnectBackup();
                case WebSocketMode.Off: 
                    skript.log.post("Request to reconnect WebSocket was ignored. Current interceptor mode: {0}", WebSocketMode[mode], Core.Log.Level.DebugLuckygames, param);
                    return;
                case WebSocketMode.Reduce: 
                    const accept = param && param.mode === WebSocketMode[WebSocketMode.Reduce];
                    if (accept) {
                        skript.log.post("Request to reconnect WebSocket was accepted. Current interceptor mode: {0}", WebSocketMode[mode], Core.Log.Level.DebugLuckygames, param);
                        return WebSocketControl.socketReconnectBackup();
                    } else {
                        skript.log.post("Request to reconnect WebSocket was ignored. Current interceptor mode: {0}", WebSocketMode[mode], Core.Log.Level.DebugLuckygames, param);
                        return;
                    }
                default: throw new Core.Errors.InvalidArgument(`WebSocketMode = ${mode}`);
            }
        }

        /**
         * Finaliza a conexão do WebSocket.
         */
        private static socketClose(): void {
            const ws = WebSocketControl.websocket();
            if (!ws) return;
            ws.close();
            skript.log.post("WebSocket was closed.", null, Core.Log.Level.DebugLuckygames, ws);
        }

        /**
         * Modo de funcionamento atual.
         * @type {WebSocketMode}
         */
        private static currentMode?: WebSocketMode;

        /**
         * Timeout para verificação no modo WebSocketMode.Reduce
         * @type {NodeJS.Timeout}
         */
        private static idTimeoutReduce?: NodeJS.Timeout;

        /**
         * Intervalo entre as verificações no modo WebSocketMode.Reduce
         * @type {number}
         */
        private static intervalTimeoutReduce: { 

            /**
             * Tempo desligado.
             */
            off: number, 

            /**
             * Tempo ligado.
             */
            on: number 
        } = { 
            off: 1000 * 60 * 5, /* 5 minutos */
            on: 1000 * 30       /* 30 segundos */
        };

        /**
         * Executa as ações para o modo WebSocketMode.Reduce.
         */
        private static executeModeReduce(): void {
            WebSocketControl.socketClose();
            WebSocketControl.idTimeoutReduce = setTimeout(() => {
                WebSocketControl.socketReconnectNew({ mode: WebSocketMode[WebSocketMode.Reduce] });
                WebSocketControl.idTimeoutReduce = setTimeout(() => {
                    WebSocketControl.executeModeReduce();
                }, WebSocketControl.intervalTimeoutReduce.on);
            }, WebSocketControl.intervalTimeoutReduce.off);
        }

        /**
         * Modo atual do funcionamento do WebSocketControl.
         * @returns {WebSocketMode} Estado atual.
         */
        public static mode(mode?: WebSocketMode): WebSocketMode {
            if (WebSocketControl.currentMode === undefined) return WebSocketMode.Normal;

            if (mode !== undefined && mode !== WebSocketControl.currentMode) {
                if (WebSocketControl.idTimeoutReduce) clearTimeout(WebSocketControl.idTimeoutReduce);

                skript.log.post("Change WebSocket mode to: {0}", WebSocketMode[mode], Core.Log.Level.DebugLuckygames);

                const ws = WebSocketControl.websocket();
                if (ws) switch (WebSocketControl.currentMode = mode) {
                    case WebSocketMode.Normal:
                        if (ws.readyState != WebSocket.OPEN) WebSocketControl.socketReconnectNew();
                        break;
                    case WebSocketMode.Off: 
                        WebSocketControl.socketClose();
                        break;
                    case WebSocketMode.Reduce:                         
                        WebSocketControl.executeModeReduce();                        
                        break;
                    default: throw new Core.Errors.InvalidArgument(`WebSocketMode = ${mode}`);
                }
            }

            return WebSocketControl.currentMode;
        }
    }
}
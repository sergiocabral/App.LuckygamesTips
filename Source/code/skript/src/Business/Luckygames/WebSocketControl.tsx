namespace Skript.Business.Luckygames {

    /**
     * Controlador do websocket da luckygames.io
     */
    export class WebSocketControl {

        /**
         * Indica se esta classe já foi inicializada.
         */
        private static initialized?: boolean;

        /**
         * Inicializa o controle do WebSocket.
         * @param {boolean} tentatives Opcional. Indica quantas tentativas por segundo.
         * @param {number} interval Opcional. Intervalo entre as tentativas.
         * @returns {Promise<boolean>} Retorna true quando há sucesso.
         */
        public static initialize(tentatives: number = 5, interval: number = 5000): Promise<boolean> {
            if (WebSocketControl.initialized !== undefined) throw new Framework.Errors.InvalidExecution("WebSocketControl.initialize() more than 1x");
            WebSocketControl.initialized = false;
            
            return new Promise(resolve => {
                const check = (tentativesCount: number) => {
                    tentativesCount++;

                    Core.Main.instance.log.post("Trying to intercept WebSocket. Attempt {0}.", tentativesCount, Framework.Log.Level.Verbose, "Luckygames Website");

                    const ws = WebSocketControl.websocket();
                    if (tentativesCount < tentatives && !ws) setTimeout(() => check(tentativesCount), interval);
                    else {
                        if (ws && ws.constructor.name !== WebSocket.name) throw new Framework.Errors.NotReady(`Luckygames.io WebSocket type: ${ws.constructor.name} == ${WebSocket.name}`);

                        const result = !!ws;

                        if (result) {
                            WebSocketControl.currentMode = WebSocketMode.Normal;
                            Core.Main.instance.log.post("WebSocket successfully intercepted.", null, Framework.Log.Level.Verbose, "Luckygames Website", ws);
                            WebSocketControl.initialized = true;
                        }
                        else {
                            WebSocketControl.currentMode = undefined;
                            Core.Main.instance.log.post("After {0] attempts it was not possible to set up global information for luckygames.io. But do not worry. This is not a serious problem.", tentatives, Framework.Log.Level.Error);
                        }

                        resolve(result);
                    }
                };
                check(0);
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
            if (!WebSocketControl.socketReconnectBackup) throw new Framework.Errors.EmptyValue("WebSocketControl.socketReconnectBackup");

            const mode = WebSocketControl.mode()            
            switch (mode) {
                case WebSocketMode.Normal: 
                    Core.Main.instance.log.post("Request to reconnect WebSocket was accepted. Current interceptor mode: {0}", WebSocketMode[mode], Framework.Log.Level.Verbose, "Luckygames Website", param);
                    return WebSocketControl.socketReconnectBackup();
                case WebSocketMode.Off: 
                    Core.Main.instance.log.post("Request to reconnect WebSocket was ignored. Current interceptor mode: {0}", WebSocketMode[mode], Framework.Log.Level.Verbose, "Luckygames Website", param);
                    return;
                case WebSocketMode.Reduce: 
                    const accept = param && param.mode === WebSocketMode[WebSocketMode.Reduce];
                    if (accept) {
                        Core.Main.instance.log.post("Request to reconnect WebSocket was accepted. Current interceptor mode: {0}", WebSocketMode[mode], Framework.Log.Level.Verbose, "Luckygames Website", param);
                        return WebSocketControl.socketReconnectBackup();
                    } else {
                        Core.Main.instance.log.post("Request to reconnect WebSocket was ignored. Current interceptor mode: {0}", WebSocketMode[mode], Framework.Log.Level.Verbose, "Luckygames Website", param);
                        return;
                    }
                default: throw new Framework.Errors.InvalidArgument(`WebSocketMode = ${mode}`);
            }
        }

        /**
         * Finaliza a conexão do WebSocket.
         */
        private static socketClose(): void {
            const ws = WebSocketControl.websocket();
            if (!ws) return;
            if (ws.readyState != WebSocket.CLOSED) {
                ws.close();
                Core.Main.instance.log.post("WebSocket was closed.", null, Framework.Log.Level.Verbose, "Luckygames Website", ws);
            }
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
            if (WebSocketControl.currentMode === undefined || !WebSocketControl.initialized) {
                if (mode !== undefined) Core.Main.instance.log.post("Failed to set up receiving global information from luckygames.io. But do not worry. This is not a serious problem.", null, Framework.Log.Level.Error);
                return WebSocketMode.Normal;
            }

            if (mode !== undefined && mode !== WebSocketControl.currentMode) {
                if (WebSocketControl.idTimeoutReduce) clearTimeout(WebSocketControl.idTimeoutReduce);

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
                    default: throw new Framework.Errors.InvalidArgument(`WebSocketMode = ${mode}`);
                }
                Core.Main.instance.log.post("Defined as \"{0}\" receiving global information from luckygames.io.", WebSocketMode[WebSocketControl.currentMode].translate(), Framework.Log.Level.Information);
                new Messages.DidWebSocketModeSetted(mode).send();
            }

            return WebSocketControl.currentMode;
        }
    }
    
    Framework.Bus.Message.capture(Messages.DoSetWebSocketMode, undefined, (message: Messages.DoSetWebSocketMode) => WebSocketControl.mode(message.mode));
    Framework.Bus.Message.capture(Messages.GetWebSocketMode, undefined, (message: Messages.GetWebSocketMode) => message.mode = WebSocketControl.mode());
}
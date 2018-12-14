namespace Skript.Framework.Bus {

    /**
     * Despachador de mensagens.
     */
    export abstract class Handler<TSponsor> {

        /**
         * Lista de mensagem para processamento.
         * @type {MessageHandler[]}
         */
        public abstract handlers: MessageHandler[];

        /**
         * Lista de instâncias.
         * @type {any}
         */
        private static list: Handler<any>[] = [];

        /**
         * Construtor.
         * @param {TSponsor} sponsor Responsável pela instância.
         */
        public constructor(sponsor: TSponsor) {
            Handler.list.push(this);
            this.sponsor = sponsor;
        }

        /**
         * Responsável pela instância.
         * @type {TSponsor}
         */
        public sponsor: TSponsor;

        /**
         * Sinaliza que este handler deve ser desativado.
         * @type {boolean}
         */
        private disposed: boolean = false;

        /**
         * Sinaliza que este handler deve ser desativado.
         */
        public dispose(): void {
            this.disposed = true;
        }

        /**
         * Envia uma mensagem para que algum handler possa processar.
         * @param {TMessage} message Mensagem.
         * @returns {TMessage} A própria mensagem enviada.
         */
        public static send<TMessage extends Message>(message: TMessage): TMessage {
            let stop = false;
            let handles = "";
            message.handled = 0;
            const messageToSend = message.constructor.name;
            for (let i = 0; i < Handler.list.length; i++) {
                if (!Handler.list[i]) continue;
                if (Handler.list[i].disposed) {
                    console.Log("A MessageHandler {0} was disposed.", Handler.list[i].constructor.name, "Bus.Handler");
                    delete Handler.list[i];
                    continue;
                }

                for (let j = 0; Array.isArray(Handler.list[i].handlers) &&
                                j < Handler.list[i].handlers.length; j++) {
                    const messageOfHandler = Handler.list[i].handlers[j].message;
                    if (messageOfHandler === messageToSend) {
                        if (!stop) {
                            const handler = Handler.list[i].handlers[j].handler.bind(Handler.list[i].sponsor);
                            stop = handler(message) === false;
                            message.handled++;
                            handles += (handles ? ", " : "") + Handler.list[i].constructor.name;

                            if (stop) {
                                handles += " - " + "Stop trigger here. Ignored:".translate();
                            }
                        } else {
                            handles += " " + Handler.list[i].constructor.name + ",";
                        }
                    }
                }
            }
            if (handles.substr(-1) === ":") handles += " 0";
            else if (handles.substr(-1) === ",") handles = handles.substr(0, handles.length - 1);
            console.Log("Message \"{0}\" sent as command and processed by {1}x: {2}", [message.constructor.name, message.handled, handles], "Bus.Handler");
            return message;
        }

        /**
         * Lista de capturar registradas.
         * @type {Capture}
         */
        private static captures: Capture[] = [];

        /**
         * Se registrar para capturar uma mensagem.
         * @param {any} message Mensagem
         * @param {any} toBind Instância usada para bind.
         * @param {Function} listener Função chamada ao captura.
         */
        public static captureOn(message: any, toBind: any, listener: Function): void {
            const capture = new Capture(message, toBind, listener);
            if (this.captures.filter(v => v.equals(capture)).length)
                throw new Framework.Errors.InvalidExecution("Duplicate Handler.captureOn().");
            window.addEventListener(capture.messageName, capture.listenerWrapper)
            console.Log("Message \"{0}\" as event was registered.", capture.messageName, "Bus.Handler");
            this.captures.push(capture);
        }

        /**
         * Cancela a captura de uma mensagem.
         * @param {any} message Mensagem
         * @param {any} toBind Instância usada para bind.
         * @param {Function} listener Função chamada ao captura.
         */
        public static captureOff(message: any, toBind: any, listener: Function): void {
            const capture = new Capture(message, toBind, listener);
            if (!this.captures.filter((v, i, a) => {
                if (v.equals(capture)) {
                    window.removeEventListener(v.messageName, v.listenerWrapper)
                    delete a[i];
                    console.Log("Message \"{0}\" as event was canceled.", capture.messageName, "Bus.Handler");
                    return true;
                } else {
                    return false;
                }
            }).length) throw new Framework.Errors.InvalidExecution("Handler.captureOn() not executed.");
        }

        /**
         * Dispara uma mensagem como evento.
         * @param {any} message Mensagem
         */
        public static trigger<TMessage extends Message>(message: TMessage): void {
            const messageName = Capture.getMessageName(message);
            const event = new CustomEvent(messageName, { detail: message });
            const captures = this.captures.filter(v => v.messageName === messageName);
            if (message.handled = captures.length) {
                window.dispatchEvent(event);
                console.Log("Message \"{0}\" triggered as event and captured by {1}x.", [messageName, captures.length], "Bus.Handler", event);
            } else {
                console.Log("Message \"{0}\" triggered as event but not captured.", messageName, "Bus.Handler", event);
            }
        }
    }
}
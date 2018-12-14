namespace Skript.Framework.Bus {

    /**
     * Despachador de mensagens e ancestral de mensagens.
     */
    export abstract class Message {

        /**
         * Retorna como string o nome da mensagem.
         * @param {any} message Mensagem.
         * @returns {string} Identificador da mensagem como string.
         */
        public static getName(message: any): string {
            let name;
            if (typeof(message) === 'string') name = message;
            else if (typeof(message) === 'object') name = message.constructor.name;
            else if (typeof(message) === 'function') name = Message.getName;
            else throw new Framework.Errors.InvalidArgument("Event must be string or object, but: " + typeof(message));
            if(!name) throw new Framework.Errors.EmptyValue("Event name is empty. Type: " + typeof(message));
            return name;
        }

        /**
         * Lista de capturar registradas.
         * @type {Capture}
         */
        private static captures: Capture[] = [];

        /**
         * Se registrar para capturar uma mensagem.
         * @param {any} message Mensagem.
         * @param {any} thisRef Instância usada para bind.
         * @param {Function} listener Função chamada ao captura.
         * @returns {Capture} Informações de captura.
         */
        public static capture(message: any, thisRef: any, listener: Function): Capture {
            const capture = new Capture(message, thisRef, listener);
            if (this.captures.filter(v => v.equals(capture)).length)
                throw new Framework.Errors.InvalidExecution("Duplicate Handler.captureOn().");
            window.addEventListener(capture.messageName, capture.listenerWrapper)
            console.Log("Message \"{0}\" capture was registered.", capture.messageName, "Bus.Handler");
            this.captures.push(capture);
            return capture;
        }

        /**
         * Cancela a captura de uma mensagem.
         * @param {Capture} capture Informações de captura.
         */
        public static captureOff(capture: Capture): void {
            if (!this.captures.filter((v, i, a) => {
                if (v.equals(capture)) {
                    window.removeEventListener(v.messageName, v.listenerWrapper)
                    delete a[i];
                    console.Log("Message \"{0}\" capture was canceled.", capture.messageName, "Bus.Handler");
                    return true;
                } else {
                    return false;
                }
            }).length) throw new Framework.Errors.InvalidExecution("Handler.captureOn() not executed.");
        }

        /**
         * Envia esta mensagem.
         * @param {any} message Mensagem
         */
        public send(): void {
            return Message.send<this>(this);
        }

        /**
         * Envia uma mensagem.
         * @param {any} message Mensagem
         */
        public static send<TMessage extends Message>(message: TMessage): void {
            const messageName = Message.getName(message);
            const event = new CustomEvent(messageName, { detail: message });
            const captures = this.captures.filter(v => v.messageName === messageName);
            if (captures.length) {
                console.Log("Message \"{0}\" sent and captured by {1}x.", [messageName, captures.length], "Bus.Handler", event);
                window.dispatchEvent(event);
            } else {
                console.Log("Message \"{0}\" sent but not captured.", messageName, "Bus.Handler", event);
            }
        }
    }
}
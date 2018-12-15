namespace Skript.Framework.Bus {

    /**
     * Informações da mensagem que deve ser capturada.
     */
    export class Capture {

        /**
         * Lista de mensagens ignoradas para log.
         */
        public static ignoreLog: string[] = [
            Util.General.getName(Messages.DidLogPosted)
        ]

        /**
         * Construtor.
         * @param {any} message Mensagem
         * @param {any} toBind Instância usada para bind.
         * @param {Function} listenerOriginal Função chamada ao capturar a mensagem.
         */
        public constructor(public message: any, public toBind: any, public listenerOriginal: Function) {
            this.messageName = Util.General.getName(message);

            const instance = this;
            this.listenerWrapper = (evt: any) => {
                const listener = instance.listenerOriginal.bind(instance.toBind);
                if (Capture.ignoreLog.indexOf(instance.messageName) < 0) console.Log("Message \"{0}\" captured.", instance.messageName, "Bus.Handler", instance);
                listener(evt.detail && typeof(evt.detail) === "object" ? evt.detail : evt);
            };
        }

        /**
         * Identificador da mensagem como string.
         * @type {string}
         */
        public messageName: string;

        /**
        * Função registrada no evento. Encapsula a original.
        * @type {Function}
        */
        public listenerWrapper: EventListenerOrEventListenerObject;

        /**
         * Registra o evento no sistema.
         */
        public addEventListener(): void {
            if (Capture.ignoreLog.indexOf(this.messageName) < 0) console.Log("Capture for message \"{0}\" was registered.", this.messageName, "Bus.Handler");
            window.addEventListener(this.messageName, this.listenerWrapper)
        }

        /**
         * Cancela o registro o evento no sistema.
         */
        public removeEventListener(): void {
            if (Capture.ignoreLog.indexOf(this.messageName) < 0) console.Log("Capture for message \"{0}\" was unregistered.", this.messageName, "Bus.Handler");
            window.removeEventListener(this.messageName, this.listenerWrapper)
        }

        /**
         * Requisita a execução do listener e retorna o valor.
         * @param {Message} message Mensagem.
         */
        public request(message: Message): void {
            const listener = this.listenerOriginal.bind(this.toBind);
            if (Capture.ignoreLog.indexOf(this.messageName) < 0) console.Log("Message \"{0}\" requested.", this.messageName, "Bus.Handler", this);
            listener(message);
        }

        /**
         * Cria uma instância de evento.
         * @param {TMessage} message Mensagem.
         */
        public static createEvent(message: Message): CustomEvent {
            return new CustomEvent(Util.General.getName(message), { detail: message });
        }

        /**
         * Compara se é conceitualmente igual a outra instância.
         * @param capture Instância para comparar.
         * @returns {boolean} Resposta se é igual.
         */
        public equals(capture: Capture): boolean {
            return (
                this.messageName === capture.messageName && 
                this.toBind === capture.toBind && 
                this.listenerOriginal === capture.listenerOriginal
            );
        }
    }
}
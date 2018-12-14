namespace Skript.Framework.Bus {

    /**
     * Informações da mensagem que deve ser capturada.
     */
    export class Capture {

        /**
         * Construtor.
         * @param {any} message Mensagem
         * @param {any} toBind Instância usada para bind.
         * @param {Function} listenerOriginal Função chamada ao capturar a mensagem.
         */
        public constructor(public message: any, public toBind: any, public listenerOriginal: Function) {
            this.messageName = Message.getName(message);
            
            const instance = this;
            this.listenerWrapper = (evt: any) => {
                const listener = instance.listenerOriginal.bind(instance.toBind);
                listener(evt);
                console.Log("Message \"{0}\" as event was executed.", instance.messageName, "Bus.Handler", event);
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
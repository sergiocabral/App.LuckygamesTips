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
            this.messageName = Capture.getMessageName(message);
            
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

        /**
         * Retorna como string o nome da mensagem.
         * @param {any} message Mensagem.
         * @returns {string} Identificador da mensagem como string.
         */
        public static getMessageName(message: any): string {
            let name;
            if (typeof(message) === 'string') name = message;
            else if (typeof(message) === 'object') name = message.constructor.name;
            else if (typeof(message) === 'function') name = message.name;
            else throw new Framework.Errors.InvalidArgument("Event must be string or object, but: " + typeof(message));
            if(!name) throw new Framework.Errors.EmptyValue("Event name is empty. Type: " + typeof(message));
            return name;
        }
    }
}
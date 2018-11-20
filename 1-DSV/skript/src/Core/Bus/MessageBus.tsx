namespace Skript.Core.Bus {

    /**
     * Despachador de mensagens.
     */
    export abstract class MessageBus<T> {
        
        /**
         * Construtor.
         * @param {T} sponsor Quem é responsável pela instância.
         */
        public constructor(sponsor: T) {
            MessageBus.list.push(this);
            this.sponsor = sponsor;
        }

        /**
         * Quem é responsável pela instância.
         * @type {T}
         */
        public sponsor: T;

        /**
         * Roteadores de comandos. Toda classe descendente que é instanciada entra nessa lista.
         * @type {any}
         */
        private static list: MessageBus<any>[] = [];

        /**
         * Envia uma mensagem para que algum handler possa processar.
         * @param message Mensagem.
         */
        public static Send(message: Message): Message {
            const messageToSend = message.constructor.name;
            for (let i = 0; i < MessageBus.list.length; i++) {
                for (let j = 0; Array.isArray(MessageBus.list[i].handlers) && 
                                j < MessageBus.list[i].handlers.length; j++) {
                    const messageOfHandler = MessageBus.list[i].handlers[j].message;
                    if (messageOfHandler === messageToSend) {
                        MessageBus.list[i].handlers[j].handler(message);
                        message.handled = true;
                    }
                }
            }
            return message;
        }

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public abstract handlers: MessageHandler[];

    }
}
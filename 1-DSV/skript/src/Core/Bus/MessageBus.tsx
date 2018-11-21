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
         * @param {Message} message Mensagem.
         * @returns {Message} A própria mensagem enviada.
         */
        public static send(message: Message): Message {
            message.handled = 0;
            const messageToSend = message.constructor.name;
            for (let i = 0; i < MessageBus.list.length; i++) {
                for (let j = 0; Array.isArray(MessageBus.list[i].handlers) && 
                                j < MessageBus.list[i].handlers.length; j++) {
                    const messageOfHandler = MessageBus.list[i].handlers[j].message;                    
                    if (messageOfHandler === messageToSend) {
                        const handler = MessageBus.list[i].handlers[j].handler.bind(MessageBus.list[i].sponsor);
                        handler(message);
                        message.handled++;
                    }
                }
            }
            skript.log.post("Message {0} dispatched and processed by {1}x.", [message.constructor.name, message.handled], Log.Level.Debug);
            return message;
        }

        /**
         * Dispara um notificador de evento.
         * @param {Object} object Objeto enviado como evento.
         */
        public static event(object: Object): void {            
            window.dispatchEvent(
                new CustomEvent(
                    object.constructor.name, 
                    { detail: object }));
            skript.log.post("Notifier {0} triggered.", object.constructor.name, Log.Level.Debug);
        }

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public abstract handlers: MessageHandler[];

    }
}
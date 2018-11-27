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
         * Indica se foi desativada.
         * @type {boolean}
         */
        private disposed: boolean = false;

        /**
         * Quando chamada tira o bus da lista de processamento.
         */
        public dispose(): void {
            this.disposed = true;
        }

        /**
         * Roteadores de comandos. Toda classe descendente que é instanciada entra nessa lista.
         * @type {any}
         */
        private static list: MessageBus<any>[] = [];

        /**
         * Envia uma mensagem para que algum handler possa processar.
         * Processamento assíncrono.
         * @param {Message} message Mensagem.
         * @returns {Message} A própria mensagem enviada.
         */
        public static sendSync(message: Message): Message {
            message.handled = 0;
            const messageToSend = message.constructor.name;
            for (let i = 0; i < MessageBus.list.length; i++) {                
                if (!MessageBus.list[i]) continue;
                if (MessageBus.list[i].disposed) {                     
                    if (!message.silentLog) skript.log.post("A MessageHandler {0} was disposed.", MessageBus.list[i].constructor.name, Log.Level.DebugBus);
                    delete MessageBus.list[i];
                    continue; 
                }

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
            if (!message.silentLog) skript.log.post("Message {0} dispatched and processed by {1}x.", [message.constructor.name, message.handled], Log.Level.DebugBus);
            return message;
        }

        /**
         * Envia uma mensagem para que algum handler possa processar.
         * Processamento assíncrono.
         * @param {Message} message Mensagem.
         * @returns {Promise<Message>} A própria mensagem enviada.
         */
        public static sendAsync(message: Message): Promise<Message> {
            return new Promise(resolve => {                
                resolve(this.sendSync(message));
            });
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
            skript.log.post("Notifier {0} triggered.", object.constructor.name, Log.Level.DebugBus);
        }

        /**
         * Lista de mensagem possíveis de serem processados.
         */
        public abstract handlers: MessageHandler[];

    }
}
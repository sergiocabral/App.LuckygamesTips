namespace Skript.Core.Bus {

    /**
     * Class abstrata para implementação de uma mensagem.
     */
    export abstract class Message {

        /**
         * Total de vezes que foi processada por um handler.
         * @type {number}
         */
        public handled: number = 0;

        /**
         * Resultados.
         * @type {any}
         */
        public result?: any;

        /**
         * Quando true não posta no log ações dessa mensagem.
         * @type {boolean}
         */
        public skipLogMessagePosted: boolean = false;

        /**
         * Envia uma mensagem para que algum handler possa processar.
         * Processamento assíncrono.
         * Mesmo que MessageBus.sendAsync();
         * @returns {Promise<Message>} A própria mensagem enviada.
         */
        public sendAsync(): Promise<Message> {
            return MessageBus.sendAsync(this);
        }

        /**
         * Envia uma mensagem para que algum handler possa processar.
         * Processamento síncrono.
         * Mesmo que MessageBus.sendSync();
         * @returns {Message} A própria mensagem enviada.
         */
        public sendSync(): Message {
            return MessageBus.sendSync(this);
        }
    }
}
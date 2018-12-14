namespace Skript.Framework.Bus {

    /**
     * Class abstrata para implementação de uma mensagem.
     */
    export abstract class Message<TResult = any> {

        /**
         * Total de vezes que foi processada por um handler.
         * @type {number}
         */
        public handled: number = 0;

        /**
         * Resultados.
         * @type {TResult}
         */
        public result?: TResult;


        /**
         * Envia uma mensagem para que algum handler possa processar.
         * Mesmo que MessageBus.send();
         * @returns {this} A própria mensagem enviada.
         */
        public send(): this {
            return Handler.send<this>(this);
        }

        /**
         * Dispara uma mensagem como evento.
         * Mesmo que MessageBus.trigger();
         */
        public trigger(): void {
            Handler.trigger<this>(this);
        }
    }
}
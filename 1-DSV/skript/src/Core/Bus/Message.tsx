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
         * O handler pode armazenar valores aqui no final do processamento.
         * @type {any}
         */
        public result: any = undefined;
    }
}
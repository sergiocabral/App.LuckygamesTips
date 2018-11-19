namespace Skript.Core.Bus {

    /**
     * Class abstrata para implementação de uma mensagem.
     */
    export abstract class Message {

        /**
         * Indica que pelo menos um handler processou.
         * @type {boolean}
         */
        public handled: boolean = false;

        /**
         * O handler pode armazenar valores aqui no final do processamento.
         * @type {any}
         */
        public result: any = undefined;
    }
}
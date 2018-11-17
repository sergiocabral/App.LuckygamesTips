namespace Core.Bus {

    /**
     * Class abstrata para implementação de comandos.
     */
    export abstract class Command {

        /**
         * Indica que pelo menos um handler processou este comando.
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
namespace Core.Bus {

    /**
     * Conjunto de informações para processar um comando.
     */
    export type CommandHandler = {
        
        /**
         * Nome do comando.
         */
        command: string,

        /**
         * Função (handler) que processa o comando.
         */
        handler: Function
    }
}
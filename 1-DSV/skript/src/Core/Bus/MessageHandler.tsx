namespace Core.Bus {

    /**
     * Conjunto de informações para processar uma mensagem.
     */
    export type MessageHandler = {
        
        /**
         * Nome da classe da mensagem.
         */
        message: string,

        /**
         * Função (handler) que faz o processamento.
         */
        handler: Function
    }
}
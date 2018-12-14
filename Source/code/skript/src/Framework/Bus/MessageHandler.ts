namespace Skript.Framework.Bus {

    /**
     * Conjunto de informações para processar uma mensagem.
     */
    export type MessageHandler<TResult = any> = {
        
        /**
         * Nome da classe da mensagem.
         */
        message: string,

        /**
         * Função (handler) que faz o processamento.
         * @returns {boolean|void} Se retorna false interrompe o processamento para outros handlers à frente
         */
        handler: (command: Message<TResult>) => boolean|void
    }
}
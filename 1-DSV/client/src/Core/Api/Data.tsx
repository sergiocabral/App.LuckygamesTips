namespace Core.Api {

    /**
     * Dado para carregamento do servidor.
     */
    export type Data = { 
        
        /**
         * Tipos de dados para carregamento do servidor.
         * @type {DataType}
         */
        type: DataType,

        /**
         * Nome do dado para retorno.
         * @type {string}
         */
        name: string,

        /**
         * Conteúdo
         * @type {string}
         */
        data: string
    }
}
namespace Skript.Framework.Errors {

    /**
     * Base para todos os erros do sistema.
     */
    export abstract class Base extends Error {
        
        /**
         * Construtor.
         * @param {string} error Descrição do erro.
         * @param {string} message Mensagem complementar.
         * @param {Error} innerError Erro interno.
         */
        public constructor(error: string, message?: string, public innerError?: Error) {
            super("SKRIPT: " + error + (message ? ": " + message : "."));
        }

        /**
         * Verifica se um objeto é um instância de erro.
         * @param {any} object Alvo do teste.
         * @returns {boolean} Teste.
         */
        public static isError(object: any): boolean {
            return object && typeof(object) === "object" && String(object.constructor.name).toLowerCase().indexOf("error") >= 0;
        }
    }

}
namespace Skript.Framework.Util {

    /**
     * Utilitários para manipulação de objetos.
     */
    export class General {

        /**
         * Retorna o nome de uma instância.
         * @param {any} instance Instância.
         * @returns {string} Nome.
         */
        public static getName(message: any): string {
            let name;
            if (typeof(message) === 'string') name = message;
            else if (typeof(message) === 'object') name = message.constructor.name;
            else if (typeof(message) === 'function') name = message.name;
            else throw new Framework.Errors.InvalidArgument("Instance must be string, object or function. Type: " + typeof(message));
            if(!name) throw new Framework.Errors.EmptyValue("Name is empty. Type: " + typeof(message));
            return name;
        }
    }
}
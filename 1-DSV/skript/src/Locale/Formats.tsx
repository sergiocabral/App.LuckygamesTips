namespace Locale {

    /**
     * Carrega configurações de localização e região.
     */
    export class Formats {

        /**
         * Valida uma string para retorna como objeto.
         * @param {string} json Dados do json como string.
         * @returns {FormatSet} Objeto.
         */
        public static parse(json: string): FormatSet {
            return JSON.parse(json) as FormatSet;
        }
    }
}
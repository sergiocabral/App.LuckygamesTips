namespace Skript.Locale {

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
            if (!json || !eval(`!!${json};`)) throw new Core.Errors.NullNotExpected("JSON");
            return JSON.parse(json) as FormatSet;
        }
    }
}
namespace Skript.Framework.Util {

    /**
     * Configurações de formatação de data.
     */
    export class DateTimeFormat {

        /**
         * Define os valores padrão para a formatação.
         * @param {any} format Object com formatação. 
         */
        public static defaults(format: any): void {
            if (!format) return;
            if (format.mask) DateTimeFormat.mask = format.mask;
            if (format.day) DateTimeFormat.day = format.day;
            if (format.days) DateTimeFormat.days = format.days;
        }

        /**
         * Monta o conjunto de formatação.
         * @param {DateTimeFormat} format Configurações de formatação.
         * @returns {DateTimeFormat} Conjunto de formatação totalmente preechido.
         */
        public static get(format?: DateTimeFormat): DateTimeFormat {
            return Object.assign({ }, new DateTimeFormat(), format) as DateTimeFormat;
        }

        /**
         * Máscara de formatação.
         *
         * Use para compor a máscara:
         *   D = dias corridos
         *   d = dia
         *   M = mês
         *   y = ano
         *   h = hora
         *   m = minuto
         *   s = segundo
         *   z = milissegundo
         *
         * Nomes de máscara:
         *   running = D h:m:s
         */
        public mask?: string = DateTimeFormat.mask;

        /**
         * Valor padrão para mask.
         * @type {string}
         */
        public static mask: string = "d/M/y h:m:s";

        /**
         * Texto usado para contabilizar 1 dia (singular).
         * @type {string}
         */
        public day?: string = DateTimeFormat.day;

        /**
         * Valor padrão para day.
         * @type {string}
         */
        public static day: string = "dia";

        /**
         * Texto usado para contabilizar 2 ou mais dias (plural).
         * @type {string}
         */
        public days?: string = DateTimeFormat.days;

        /**
         * Valor padrão para days.
         * @type {string}
         */
        public static days: string = "dias";
    }
}
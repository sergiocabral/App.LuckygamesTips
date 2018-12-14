namespace Skript.Framework.Util {

    /**
     * Configurações de formatação de número.
     */
    export class NumericFormat {

        /**
         * Define os valores padrão para a formatação.
         * @param {any} format Object com formatação. 
         */
        public static defaults(format: any): void {
            if (!format) return;
            if (format.digits) NumericFormat.digits = format.digits;
            if (format.decimal) NumericFormat.decimal = format.decimal;
            if (format.showPositive) NumericFormat.showPositive = format.showPositive;
            if (format.prefix) NumericFormat.prefix = format.prefix;
            if (format.suffix) NumericFormat.suffix = format.suffix;
        }

        /**
         * Monta o conjunto de formatação.
         * @param {NumericFormat} format Configurações de formatação.
         * @returns {NumericFormat} Conjunto de formatação totalmente preechido.
         */
        public static get(format?: NumericFormat): NumericFormat {
            return Object.assign({ }, new NumericFormat(), format) as NumericFormat;
        }

        /**
         * Dígitos decimais.
         * @type {number}
         */
        public digits?: number = NumericFormat.digits;

        /**
         * Valor padrão para digits.
         * @type {number}
         */
        public static digits: number = 2;

        /**
         * Caracter usado como vírgula.
         * @type {string}
         */
        public decimal?: string = NumericFormat.decimal;

        /**
         * Valor padrão para decimal.
         * @type {string}
         */
        public static decimal: string = '.';

        /**
         * Exibe o sinal de positivo sempre.
         * @type {boolean}
         */
        public showPositive?: boolean = NumericFormat.showPositive;

        /**
         * Valor padrão para showPositive.
         * @type {boolean}
         */
        public static showPositive: boolean = false;

        /**
         * Texto anexado no início do resultado.
         * @type {string}
         */
        public prefix?: string = NumericFormat.prefix;

        /**
         * Valor padrão para prefix.
         * @type {string}
         */
        public static prefix: string = '';

        /**
         * Texto anexado no final do resultado.
         * @type {string}
         */
        public suffix?: string = NumericFormat.suffix;

        /**
         * Valor padrão para suffix.
         * @type {string}
         */
        public static suffix: string = '';
    }
}
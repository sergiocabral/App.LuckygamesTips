namespace Util {

    /**
     * Utilitários para manipulação de números.
     */
    export class Number {

        /**
         * Configurações padrão de formatação de número.
         */
        public static defaultNumberFormat: Locale.Format.Number = {
            digits: 8,
            decimal: ".",
            showPositive: false,
            prefix: "",
            sufix: ""
        };

        /**
         * Formata a exibição de um número.
         * @param {number} value Valor.
         * @param {any} config Configurações de formatação.
         * @returns {string} Número formatado como texto.
         */
        public static format(value: number, config: any): string {
            const configuration = Object.assign({ }, Number.defaultNumberFormat, config) as Locale.Format.Number;
    
            if (typeof(configuration.digits) !== 'number' || configuration.digits < 0) 
                configuration.digits = Number.defaultNumberFormat.digits;
            if (typeof(configuration.decimal) !== 'string' || configuration.decimal.length != 1)
                configuration.decimal = Number.defaultNumberFormat.decimal; 
            if (typeof(configuration.showPositive) !== 'boolean') 
                configuration.showPositive = Number.defaultNumberFormat.showPositive; 
            if (typeof(configuration.prefix) !== 'string') 
                configuration.prefix = Number.defaultNumberFormat.prefix; 
            if (typeof(configuration.sufix) !== 'string') 
                configuration.sufix = Number.defaultNumberFormat.sufix; 

            let result: string = value.toFixed(configuration.digits);
            if (configuration.decimal !== '.') result = result.replace('.', configuration.decimal);
            if (configuration.showPositive && value >= 0) result = '+' + result;
            return configuration.prefix + result + configuration.sufix;
        }

    }
}
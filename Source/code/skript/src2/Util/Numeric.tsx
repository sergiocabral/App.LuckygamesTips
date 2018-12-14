namespace Skript.Util {

    /**
     * Utilitários para manipulação de números.
     */
    export class Numeric {

        /**
         * Retorna um valor randômico 
         * @param {number} length Dígitos inteiros
         */
        public static random(length: number = 10): number {
            do {
                const result = Math.trunc(Math.random() * Math.pow(10, length));
                if (result.toString().length === length) return result;
            } while (true);
        }

        /**
         * Configurações padrão de formatação de número.
         */
        public static defaultNumberFormat: Locale.Format.Number = {
            digits: 8,
            decimal: ",",
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
            const configuration = Object.assign({ }, Numeric.defaultNumberFormat, config) as Locale.Format.Number;
    
            if (typeof(configuration.digits) !== 'number' || configuration.digits < 0) 
                configuration.digits = Numeric.defaultNumberFormat.digits;
            if (typeof(configuration.decimal) !== 'string' || configuration.decimal.length != 1)
                configuration.decimal = Numeric.defaultNumberFormat.decimal; 
            if (typeof(configuration.showPositive) !== 'boolean') 
                configuration.showPositive = Numeric.defaultNumberFormat.showPositive; 
            if (typeof(configuration.prefix) !== 'string') 
                configuration.prefix = Numeric.defaultNumberFormat.prefix; 
            if (typeof(configuration.sufix) !== 'string') 
                configuration.sufix = Numeric.defaultNumberFormat.sufix; 

            let result: string = value.toFixed(configuration.digits);
            if (configuration.decimal !== '.') result = result.replace('.', configuration.decimal);
            if (configuration.showPositive && value >= 0) result = '+' + result;
            return configuration.prefix + result + configuration.sufix;
        }

    }
}
namespace Skript.Framework.Util {

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
         * Formata a exibição de um número.
         * @param {number} value Valor.
         * @param {NumericFormat} format Opcional. Configurações de formatação.
         * @returns {string} Número formatado como texto.
         */
        public static format(value: number, format?: NumericFormat): string {
            const formatFullFill = NumericFormat.get(format);
    
            let result: string = value.toFixed(formatFullFill.digits);
            if (formatFullFill.decimal !== '.') result = result.replace('.', formatFullFill.decimal as string);
            if (formatFullFill.showPositive && value >= 0) result = '+' + result;
            return formatFullFill.prefix + result + formatFullFill.suffix;
        }

    }
}
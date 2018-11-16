namespace Locale.Format {

    /**
     * Configurações de formatação de número.
     */
    export type Number = {

        /**
         * Dígitos decimais.
         * @type {number}
         */
        digits: number,

        /**
         * Caracter usado como vírgula.
         * @type {string}
         */
        decimal: string,

        /**
         * Exibe o sinal de positivo sempre.
         * @type {boolean}
         */
        showPositive: boolean,

        /**
         * Texto anexado no início do resultado.
         * @type {string}
         */
        prefix: string,

        /**
         * Texto anexado no final do resultado.
         * @type {string}
         */
        sufix: string 
    }
}
/**
 * Interface para extender propriedades de Number.
 */
interface Number {
   
    /**
     * Formata a exibição de um número.
     * @param {any} config Configurações de formatação.
     * @returns {string} Número formatado como texto.
     */
    format(config: any): string;    
}

/**
 * Configurações de formatação.
 */
type NumberFormat = {
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

const defaultNumberFormat: NumberFormat = {
    digits: 8,
    decimal: ".",
    showPositive: false,
    prefix: "",
    sufix: ""
};

Number.prototype.format = function(config: any = { }): string {
    const configuration = Object.assign({ }, defaultNumberFormat, config) as NumberFormat;
    
    if (typeof(configuration.digits) !== 'number' || configuration.digits < 0) 
        configuration.digits = defaultNumberFormat.digits;
    if (typeof(configuration.decimal) !== 'string' || configuration.decimal.length != 1)
        configuration.decimal = defaultNumberFormat.decimal; 
    if (typeof(configuration.showPositive) !== 'boolean') 
        configuration.showPositive = defaultNumberFormat.showPositive; 
    if (typeof(configuration.prefix) !== 'string') 
        configuration.prefix = defaultNumberFormat.prefix; 
    if (typeof(configuration.sufix) !== 'string') 
        configuration.sufix = defaultNumberFormat.sufix; 

    let result: string = this.toFixed(configuration.digits);
    if (configuration.decimal !== '.') result = result.replace('.', configuration.decimal);
    if (configuration.showPositive && this >= 0) result = '+' + result;
    return configuration.prefix + result + configuration.sufix;
};
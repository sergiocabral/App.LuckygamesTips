/**
 * Interface para extender propriedades de Number.
 */
interface Number {

    /**
     * Formata a exibição de um número.
     * @param {Skript.Framework.Util.NumericFormat} format Opcional. Configurações de formatação.
     * @returns {string} Número formatado como texto.
     */
    format(format?: Skript.Framework.Util.NumericFormat): string;
}

Number.prototype.format = function(format?: Skript.Framework.Util.NumericFormat): string {
    return Skript.Framework.Util.Numeric.format(Number(this), format);
};
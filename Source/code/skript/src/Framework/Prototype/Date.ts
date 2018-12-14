/**
 * Interface para extender propriedades de Date.
 */
interface Date {

    /**
     * Formata a exibição de uma data.
     * @param {Skript.Framework.Util.DateTimeFormat} format Opcional. Configurações de formatação.
     * @returns {string} Data formatada como texto.
     */
    format(format?: Skript.Framework.Util.DateTimeFormat): string;
}

Date.prototype.format = function(format?: Skript.Framework.Util.DateTimeFormat): string {
    return Skript.Framework.Util.DateTime.format(this, format);
};

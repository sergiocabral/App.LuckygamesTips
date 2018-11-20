/**
 * Interface para extender propriedades de Date.
 */
interface Date {

    /**
     * Formata a exibição de uma data.
     * @param {any} config Configurações de formatação.
     * @returns {string} Data formatada como texto.
     */
    format(/* config: any */): string;
}

Date.prototype.format = function(config: any = { }): string {
    return Skript.Util.DateTime.format(this, config);
};

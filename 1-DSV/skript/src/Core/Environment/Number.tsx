/**
 * Interface para extender propriedades de Number.
 */
interface Number {
   
    /**
     * Formata a exibição de um número.
     * @param {any} config Configurações de formatação.
     * @returns {string} Número formatado como texto.
     */
    format(/* config: any */): string;    
}

Number.prototype.format = function(config: any = { }): string {
    return Skript.Util.Number.format(Number(this), config);
};
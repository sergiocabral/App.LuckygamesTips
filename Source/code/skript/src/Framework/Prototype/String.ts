/**
 * Interface para extender propriedades de String.
 */
interface String {

    /**
     * Retorna um valor randômico 
     * @param {number} length Opcional. Comprimento da string
     */
    random(length?: number): string;

    /**
     * Substitui todas as ocorrências de uma string.
     * @param {string} search String procurada.
     * @param {string} replacement String de substituição.
     * @returns {string} String com substituições.
     */
    replaceAll(search: string, replacement: string): string;

    /**
     * Escapa uma string para ser usada como literal numa expressão regular.
     * @returns {string}
     */
    escapeRegExp(): string;

    /**
     * Incrementa um número representado numa string.
     * Permite fazer operações de adição e substração com números de qualquer comprimento.
     * @param {number} increment Número.
     * @param {number} radix Opcional. Base númerica.
     * @returns {string} Número em formato texto com devido incremento.
     */
    inc(increment: number, radix: number): string;

    /**
     * Substitui variáveis na string por seus respectivos valores.
     * @param {any} values Opcional. Conjunto de valores para substituição na string.
     * @returns {string} Texto com variáveis substituidas por valores.
     */
    querystring(values: any): string;

    /**
     * Extrai um hash de uma string.
     * @param value Valor.
     */
    hash(): number;

    /**
     * Retorna um texto traduzido.
     * @param {any} values Opcional. Conjunto de valores para substituição na string.
     * @param {string} language Opcional. Idioma.
     */
    translate(values?: any, language?: string): string;

    /**
     * Remove espaços duplos em todo o texto.
     * @param {string[]} quotes Opcional. Lista caracteres considerado aspas. Não remove espaço dentro de aspas.
     * @param {string[]} spaces Opcional. Lista caracteres considerado espaço em branco. Serão removido duplicações.
     * @returns {string} Texto sem espaços duplos.
     */
    trimAll(quotes?: string[], spaces?: string[]): string;
}

String.prototype.random = function(length?: number): string {
    return Skript.Framework.Util.Text.random(String(this), length);
}

String.prototype.translate = function(values?: any, language?: string): string {
    return Skript.Framework.Data.Translate.get(String(this), values, language);
}

String.prototype.replaceAll = function(search: string, replacement: string): string {
    return Skript.Framework.Util.Text.replaceAll(String(this), search, replacement);
};

String.prototype.escapeRegExp = function(): string {
    return Skript.Framework.Util.Text.escapeRegExp(String(this));
};

String.prototype.inc = function(increment: number = 1, radix: number = 10): string {
    return Skript.Framework.Util.Text.inc(String(this), increment, radix);
};

String.prototype.querystring = function(values: any): string {
    return Skript.Framework.Util.Text.querystring(String(this), values);
};

String.prototype.hash = function(): number {
    return Skript.Framework.Util.Text.hash(String(this));
};

String.prototype.trimAll = function(quotes?: string[], spaces?: string[]): string {
    return Skript.Framework.Util.Text.trimAll(String(this), quotes, spaces);
}
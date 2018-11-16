/**
 * Interface para extender propriedades de String.
 */
interface String {
    
    /**
     * Substitui todas as ocorrências de uma string.
     * @param {string} search String procurada.
     * @param {string} replacement String de substituição.
     * @returns {string}
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
     * @param num Número.
     * @param radix Opcional. Base númerica.
     */
    inc(num: number, radix: number): string;
}

String.prototype.replaceAll = function(search: string, replacement: string): string {
    return this.replace(new RegExp(search.escapeRegExp(), 'g'), replacement);
};

String.prototype.escapeRegExp = function(): string {
    return this.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

String.prototype.inc = function(num: number = 1, radix: number = 10): string {
    const len = 4;
    const block = this.slice(-len);
    let hex = (parseInt(block, radix) + num).toString(radix);

    if (hex === 'NaN') return String(NaN);

    if (hex.length < len && this.length > 4) hex = '0'.repeat(len - hex.length) + hex;

    if (hex.length !== len && this.length > len) {
        const extra = parseInt(hex.substr(0, hex.length - len), radix);
        const result = this.substr(0, this.length - len).inc(extra, radix);
        if (result === 'NaN') return String(NaN);
        return result + hex.slice(-len);
    }

    return this.substr(0, this.length - len) + hex;
};
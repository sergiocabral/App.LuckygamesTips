namespace Skript.Framework.Util {

    /**
     * Utilitários para manipulação e geração de string.
     */
    export class Text {

        /**
         * Armazena os valores randômicos fixos.
         */
        private static randomFixed: Types.Index = { };

        /**
         * Retorna um valor randômico 
         * @param {string} generator Opcional. Quando informado gera um randômico fixo para este valor em futuras consultas.
         * @param {number} length Opcional. Comprimento da string
         */
        public static random(generator?: string, length: number = 10): string {
            if (generator && Text.randomFixed[generator]) {
                if (length != Text.randomFixed[generator].length) throw new Errors.InvalidArgument("Cannot change length after randomized.");
                return Text.randomFixed[generator];
            }
            let result = "";
            while (result.length < length) result += btoa(Math.random().toString()).substr(5).replace(/([^a-z0-9]|^[0-9]*)/gi, '');
            result = result.substr(0, length);
            if (generator) Text.randomFixed[generator] = result;
            return result;
        }

        /**
         * Substitui variáveis na string por seus respectivos valores.
         * @param {string} text Texto original
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @returns {string} Texto com variáveis substituidas por valores.
         */
        public static querystring(text: string, values: any = { }): string {
            let result = text;
            if (Array.isArray(values)) {
                for (let i = 0; i < values.length; i++) {
                    result = Text.replaceAll(result, `{${i}}`, values[i]);
                }
            } else if (typeof(values) === "object") {
                for (const value in values) {
                    result = Text.replaceAll(result, `{${value}}`, values[value]);
                }
            } else {
                result = Text.replaceAll(result, `{0}`, values);
            }
            return result;
        }

        /**
         * Extrai um hash de uma string.
         * @param {string} value Valor.
         */
        public static hash(value: string): number {
            return value.split("").reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a
            }, 0);              
        }

        /**
         * Substitui todas as ocorrências de uma string.
         * @param {string} value Valor.
         * @param {string} search String procurada.
         * @param {string} replacement String de substituição.
         * @returns {string} String com substituições.
         */
        public static replaceAll(value: string, search: string, replacement: string): string {
            return value.replace(new RegExp(Text.escapeRegExp(search), 'g'), replacement);
        };
        
        /**
         * Escapa uma string para ser usada como literal numa expressão regular.
         * @param {string} value Valor.
         * @returns {string}
         */
        public static escapeRegExp(value: string): string {
            return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        };
        
        /**
         * Incrementa um número representado numa string.
         * Permite fazer operações de adição e substração com números de qualquer comprimento.
         * @param {string} value Valor.
         * @param {number} increment Número.
         * @param {number} radix Opcional. Base númerica.
         * @returns {string} Número em formato texto com devido incremento.
         */
        public static inc = function(value: string, increment: number = 1, radix: number = 10): string {
            const len = 4;
            const block = value.slice(-len);
            let hex = (parseInt(block, radix) + increment).toString(radix);
        
            if (hex === 'NaN') return NaN.toString();
        
            if (hex.length < len && value.length > 4) hex = '0'.repeat(len - hex.length) + hex;
        
            if (hex.length !== len && value.length > len) {
                const extra = parseInt(hex.substr(0, hex.length - len), radix);
                const result = Util.Text.inc(value.substr(0, value.length - len), extra, radix);
                if (result === 'NaN') return NaN.toString();
                return result + hex.slice(-len);
            }
        
            return value.substr(0, value.length - len) + hex;
        };

        /**
         * Remove espaços duplos em todo o texto.
         * @param {string} text Texto.
         * @param {string[]} quotes Opcional. Lista caracteres considerado aspas. Não remove espaço dentro de aspas.
         * @param {string[]} spaces Opcional. Lista caracteres considerado espaço em branco. Serão removido duplicações.
         * @returns {string} Texto sem espaços duplos.
         */
        public static trimAll(text: string, quotes: string[] = ['"', "'", '`', "´"], spaces: string[] = [" ", "\r", "\n", "\t"]): string {
            let trimmed = '';
            let openQuote = "";
            let space = false;
            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                if (!openQuote.length && spaces.indexOf(char) >= 0) {
                    if (space) {
                        char = "";
                    } else {
                        space = true;
                        char = " ";
                    }
                } else {
                    space = false;
                    if (quotes.indexOf(char) >= 0) {
                        if (openQuote.length && openQuote[0] === char) {
                            openQuote = openQuote.substr(1);
                        } else {
                            openQuote = char + openQuote;
                        }
                    }
                }
                trimmed += char;
            }
            return trimmed.trim();
        }
    }
}
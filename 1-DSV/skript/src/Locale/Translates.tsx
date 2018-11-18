namespace Locale {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const all: Core.All;

    /**
     * Manipulador de traduções.
     */
    export class Translates {

        /**
         * Construtor.
         * @param {string} phrases Idioma padrão.
         */
        public constructor(languageDefault: string) {
            all.translate = this;
            
            this.languageDefault = languageDefault;
        }

        /**
         * Idioma padrão.
         * @type {string}
         */
        public languageDefault: string;

        /**
         * Lista de traduções.
         * @type {Translate[]}
         */
        public translates: Translate[] = [];

        /**
         * Carrega uma lista de traduções.
         * @param {Translate[]} translates Lista de idiomas.
         */
        public load(translates: Translate[]): void {
            this.translates = this.translates.concat(translates);
        }
        
        /**
         * Retorna a tradução de um texto em um determinado idioma.
         * @param {string} id Identificador do texto.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {string} language Opcional. Idioma.
         * @returns {string} Texto traduzido.
         */
        public get(id: string, values: any = { }, language: string = this.languageDefault): string {            
            let translated = id;
            for (let i = 0; i < this.translates.length; i++) {
                if (this.translates[i].id === id && this.translates[i].language === language) {
                    translated = this.translates[i].translated;
                    break;
                }
            }
            return translated.querystring(values);
        }

        /**
         * Valida uma string para retorna como objeto.
         * @param {string} json Dados do json como string.
         * @returns {Translate[]} Objeto.
         */
        public static parse(json: string): Translate[] {
            return !json ? [] : (JSON.parse(json) as []).map(i => { 
                return { 
                    language: all.translate.languageDefault,
                    id: Object.keys(i)[0] as string,
                    translated: i[Object.keys(i)[0]] as string
                }
            });
        }
    }
}
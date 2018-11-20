namespace Skript.Locale {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Manipulador de traduções.
     */
    export class Translates {

        /**
         * Construtor.
         * @param {string} phrases Idioma padrão.
         */
        public constructor(languageDefault: string) {
            skript.translate = this;
            
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
        private translates: Translate[] = [];

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
            if (!json || !eval(`!!${json};`)) throw new Error("JSON is null.");
            
            return (JSON.parse(json) as any[]).map(val => { 
                return { 
                    language: skript.translate.languageDefault,
                    id: Object.keys(val)[0] as string,
                    translated: val[Object.keys(val)[0]] as string
                }
            });
        }
    }
}
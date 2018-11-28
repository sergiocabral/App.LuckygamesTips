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
            skript.translate = skript.translate ? skript.translate : this;

            new TranslatesBus(this);
            
            this.languageDefault = languageDefault;

            skript.log.post("Language default: {0}", languageDefault, Core.Log.Level.Debug);
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
         * Define um idioma.
         * @param {string} language Idioma.
         * @returns {string} Retorna o idioma anterior.
         */
        public setLanguage(language: string): string {
            const old = skript.storage.data().language;
            
            if (old === language) return "";

            skript.storage.data({ language: language });
            skript.log.post("Change language from {old} to {new}. You need to refresh the page to make the change.", { old: old.toUpperCase(), new: language.toUpperCase() });

            new Message.LanguageChanged(old, language).sendAsync();

            return old;
        }

        /**
         * Valida uma string para retorna como objeto.
         * @param {string} json Dados do json como string.
         * @returns {Translate[]} Objeto.
         */
        public static parse(json: string): Translate[] {
            if (!json || !eval(`!!${json};`)) throw new Error("JSON is null.");
            
            const process = (object: any, translates: Translate[]): Translate[] => {
                for (const key in object) {
                    if (!Array.isArray(object[key])) process(object[key], translates);
                    else for (let i = 0; i < object[key].length; i++)
                        translates.push({
                            language: skript.translate.languageDefault,
                            id: Object.keys(object[key][i])[0] as string,
                            translated: object[key][i][Object.keys(object[key][i])[0]] as string
                        });
                }
                return translates;
            }
            return process(JSON.parse(json), []);
        }
    }
}
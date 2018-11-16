namespace Core.Locale {

    /**
     * Manipulador de traduções
     */
    export class Translates {

        /**
         * Instância para uso global no sistema.
         * @type {Translates}
         */
        private static instance: Translates|undefined;

        /**
         * Define uma instância para uso global no sistema.
         * Só pode ser definido uma vez.
         * @param {Translates} instance Instância global.
         */
        public static setInstance(instance: Translates): void {
            if (this.instance) throw new Error(Core.Locale.Translates.getInstance().get("Está é uma instância global de {name} e não pode ser redefinida.", { name: "Translates" }));
            this.instance = instance;
        }

        /**
         * Retorna a instância de uso global.
         * @returns {Translates} Instância global.
         */
        public static getInstance(): Translates {
            if (!this.instance) throw new Error(Core.Locale.Translates.getInstance().get("Está instância global de {name} ainda não foi definida.", { name: "Translates" }));
            return this.instance;
        }

        /**
         * Construtor.
         * @param {string} phrases Idioma padrão.
         */
        public constructor(languageDefault: string) {
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
         * @param {any} values Opcional. Conjunto de valores para uso na string de tradução.
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

            if (typeof(values) === "object") {
                for (const value in values) {
                    translated = translated.replaceAll(`{${value}}`, values[value]);
                }
            }

            return translated;
        }
    }
}
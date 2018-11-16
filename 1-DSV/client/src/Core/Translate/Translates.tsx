namespace Core.Translate {

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
            if (this.instance) throw new Error("A instância global de tradução não pode ser redefinida.");
            this.instance = instance;
        }

        /**
         * Retorna a instância de uso global.
         * @returns {Translates} Instância global.
         */
        public static getInstance(): Translates {
            if (!this.instance) throw new Error("A instância global de tradução ainda não foi definida.");
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
         * @type {Unit[]}
         */
        public translates: Unit[] = [];

        /**
         * Carrega uma lista de traduções.
         * @param {Unit[]} translates Lista de idiomas.
         */
        public load(translates: Unit[]): void {
            this.translates = this.translates.concat(translates);
        }
        
        /**
         * Retorna a tradução de um texto em um determinado idioma.
         * @param {string} id Identificador do texto.
         * @param {string} language Opcional. Idioma.
         * @returns {string} Texto traduzido.
         */
        public get(id: string, language: string = this.languageDefault): string {            
            for (let i = 0; i < this.translates.length; i++) {
                if (this.translates[i].id === id && this.translates[i].language === language) {
                    return this.translates[i].translated;
                } 
            }
            return id;
        }
    }
}
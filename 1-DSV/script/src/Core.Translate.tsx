namespace Core {

    /**
     * Texto traduzido.
     */
    export type TranslateItem = { 

        /**
         * Idioma.
         */
        language: string, 

        /**
         * Tradução.
         */
        text: string

    };

    /**
     * Identificador e seus respectivos textos traduzidos.
     */
    export type Translate = {

        /**
         * Texto identificado.
         */
        key: string,

        /**
         * Respectivas traduções.
         */
        translates: TranslateItem[]

    }

    /**
     * ManipulaManipula traduções de textos.
     */
    export class Translates {

        /**
         * Idioma padrão.
         */
        public languageDefault: string;

        /**
         * Lista de traduções.
         */
        public translates: Translate[];
        
        /**
         * Construtor.
         * @param  {Translate[]} translates Lista de traduções.
         */
        public constructor(translates: Translate[]) {
            this.languageDefault = "en";
            this.translates = translates;
        }

        /**
         * Retorna a tradução de um texto.
         * @param  {string} key Texto identificado.
         * @param  {string} language Idioma.
         * @returns string Texto traduzido.
         */
        public get(key: string, language: string = this.languageDefault): string {
            for (let i = 0; i < this.translates.length; i++) {
                if (key === this.translates[i].key) {
                    for (let j = 0; j < this.translates[i].translates.length; j++) {
                        if (language === this.translates[i].translates[j].language) {
                            return this.translates[i].translates[j].text;
                        }
                    }
                }
            }
            return key;
        }
    }
}
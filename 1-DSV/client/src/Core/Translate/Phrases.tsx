namespace Core.Translate {

    /**
     * Manipulador de traduções
     */
    export class Phrases {

        /**
         * Idioma padrão.
         * @type {string}
         */
        public languageDefault: string;

        /**
         * Lista de traduções.
         * @type {Phrase[][]}
         */
        public phrases: Phrase[][];
        
        /**
         * Construtor.
         * @param {Phrase[][]} phrases Lista de traduções.
         */
        public constructor(phrases: Phrase[][]) {
            this.languageDefault = "en";
            this.phrases = phrases;
        }

        /**
         * Retorna a tradução de um texto em um determinado idioma.
         * @param {string} text Texto para tradução.
         * @param {string} language Opcional. Idioma.
         * @returns {string} Texto traduzido.
         */
        public get(text: string, language: string = this.languageDefault): string {
            for (let i = 0; i < this.phrases.length; i++) {
                for (let j = 0; j < this.phrases[i].length; j++) {
                    if (text === this.phrases[i][j].text) {
                        if (language !== this.phrases[i][j].language) {
                            for (let k = 0; k < this.phrases[i].length; k++) {
                                if (language !== this.phrases[i][k].language) 
                                    return this.phrases[i][k].text;
                            }
                        }
                        return this.phrases[i][j].text;
                    }
                }
            }
            return text;
        }
    }
}
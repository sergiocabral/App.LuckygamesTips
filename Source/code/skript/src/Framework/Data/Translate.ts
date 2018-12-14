namespace Skript.Framework.Data {
    
    /**
     * Consulta de textos traduzidos.
     */
    export class Translate {

        /**
         * Instância padrão para uso geral do sistema.
         * @type {Translate}
         */
        public static default: Translate;

        /**
         * Contrutor.
         * @param {string} language Idioma.
         * @param {boolean} setDefault Opcional. Define a instância como padrão do sistema.
         */
        public constructor(public language: string, setDefault: boolean = false) {
            if (setDefault) {
                if (!Translate.default) Translate.default = this;
                else throw new Errors.InvalidExecution("Translate.default already defined.");

                Bus.Message.capture(Messages.DoSetLanguage, this, this.onDoSetLanguage);
            }
        }

        /**
         * Ao receber mensagem para definir idioma.
         * @param {Messages.DoSetLanguage} message 
         */
        private onDoSetLanguage(message: Messages.DoSetLanguage): void {
            message.language = Core.Main.instance.storage.data({ language: message.language }).language;
        }


        /**
         * Fonte de traduções.
         * @type {Types.Index<Types.Index>}
         */
        public translates: Types.Index<Types.Index> = { };

        /**
         * Carrega traduções.
         * @param {any} source Fonte de traduções.
         * @param {string} language Opcional. Idioma.
         */
        public load(source: any, language: string = this.language): void {
            this.translates[language] = this.translates[language] ? this.translates[language] : { };
            const find = (destination: Types.Index, source: any) => {
                for (const key in source) {
                    if (typeof(source[key]) === 'string') destination[key] = source[key];
                    else find(destination, source[key]);
                }
            };
            find(this.translates[language], source);
        }

        /**
         * Retorna um texto traduzido.
         * @param {string} text Texto.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {string} language Opcional. Idioma.
         */
        public get(text: string, values?: any, language: string = this.language): string {
            let translated = this.translates[language] && this.translates[language][text] !== undefined ? 
                this.translates[language][text] : text;
            return translated.querystring(values);
        }

        /**
         * Retorna um texto traduzido.
         * @param {string} text Texto.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {string} language Opcional. Idioma.
         */
        public static get(text: string, values?: any, language?: string): string {
            if (Translate.default) return Translate.default.get(text, values, language);
            else return text.querystring(values);
        }
    }
}
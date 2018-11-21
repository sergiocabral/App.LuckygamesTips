namespace Skript.Layout.Theme {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Conjuntos de propriedades de stylesheet que configuram o layout.
     */
    export class Stylesheet {

        /**
         * Construtor.
         * @param {Colors} colors Tema de cores para configurar o layout.
         */
        public constructor(colors: Colors = skript.data.colors) {
            skript.stylesheet = skript.stylesheet ? skript.stylesheet : this;

            this.colors = colors;
            this.zIndex = 1000;
            this.generalTextFont = "'Hind Siliguri', sans-serif";
            this.generalTextColor = Util.Drawing.blend(-0.5, colors.primary);
            this.generalBackground = "#ffffff";
            this.dialogTextFont = "'Raleway', sans-serif";
            this.dialogTitleTextColor = Util.Drawing.blend(-0.5, colors.secondary);
            this.dialogTitleBackground = Util.Drawing.blend(0.5, colors.secondary);

            this.generalStylesheet();
        }

        /**
         * Tema de cores para configurar o layout.
         * @type {Colors}
         */
        public colors: Colors;

        /**
         * Altura z-index mínima do layout do sistema.
         * @type {number}
         */
        public zIndex: number;

        /**
         * Fonte de texto em geral.
         * @type {string}
         */
        public generalTextFont: string;

        /**
         * Cor de texto em geral.
         * @type {string}
         */
        public generalTextColor: string;

        /**
         * Fundo em geral.
         * @type {string}
         */
        public generalBackground: string;

        /**
         * Fonte de texto do título das janelas de diálogo.
         * @type {string}
         */
        public dialogTextFont: string;

        /**
         * Cor do texto do título das janelas de diálogo.
         * @type {string}
         */
        public dialogTitleTextColor: string;

        /**
         * Fundo do título das janelas de diálogo.
         * @type {string}
         */
        public dialogTitleBackground: string;

        /**
         * Cores padrão para o tema.
         */
        public static getColorsDefault(): Colors {
            return {
                primary: "#007bff",
                secondary: "#6c757d",
                positive: "#28a745",
                negative: "#dc3545"
            };
        }

        /**
         * Nome descritivo do sistema
         * @type {string}
         */
        public title: string = skript.configuration.name;

        /**
         * Url do servidor.
         * @type {string}
         */
        public url: string = skript.configuration.server;
        
        /**
         * Define classes CSS de uso geral.
         */
        public generalStylesheet(): void {
            const selector = `.${Presentation.className}`;
            const styles: string[] = [];
            
            styles.push(`
                ${selector} button:not(.no-shadow),
                ${selector} .shadow {
                    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.5);
                }
                ${selector} button:not(.no-shadow):hover,
                ${selector} .shadow:hover {
                    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.6);
                }
                ${selector} button:not(.no-shadow):active,
                ${selector} .shadow:active {
                    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
                }
            `);

            Util.DOM.stylesheetCode(styles.join(""));
        }

        /**
         * Valida uma string para retorna como objeto.
         * @param {string} json Dados do json como string.
         * @returns {Translate[]} Objeto.
         */
        public static parse(json: string): Colors {
            if (!json || !eval(`!!${json};`)) throw new Error("JSON is null.");
            return JSON.parse(json) as Colors;
        }
    }
}
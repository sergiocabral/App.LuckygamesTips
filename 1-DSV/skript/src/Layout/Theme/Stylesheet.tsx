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
            this.generalBackgroundColor = "#ffffff";
            this.dialogTextFont = "'Raleway', sans-serif";
            this.dialogTitleTextColor = Util.Drawing.blend(-0.5, colors.secondary);
            this.dialogTitleBackgroundColor = Util.Drawing.blend(0.5, colors.secondary);

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
        public generalBackgroundColor: string;

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
        public dialogTitleBackgroundColor: string;

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
            
            //Classes de uso geral
            styles.push(`
                ${selector} .width100 { width: 100%; }
                ${selector} .width90 { width: 90%; }
                ${selector} .width80 { width: 80%; }
                ${selector} .width70 { width: 70%; }
                ${selector} .width60 { width: 60%; }
                ${selector} .width50 { width: 50%; }
                ${selector} .width40 { width: 40%; }
                ${selector} .width30 { width: 30%; }
                ${selector} .width20 { width: 20%; }
                ${selector} .width10 { width: 10%; }
                ${selector} .alignLeft { text-align: left; }
                ${selector} .alignCenter { text-align: center; }
                ${selector} .alignRight { text-align: right; }
                ${selector} .valignTop { vertical-align: top; }
                ${selector} .valignMiddle { vertical-align: middle; }
                ${selector} .valignBottom { vertical-align: bottom; }
                ${selector} .nowrap { white-space: nowrap; }
            `);

            //Elementos de tabela
            styles.push(`
                ${selector} table th { vertical-align: middle; }
                ${selector} table td { vertical-align: top; }
            `);

            //Elementos <h1>, <h2>, ...
            styles.push(`
                ${selector} h1 {
                    font-family: 'Raleway', sans-serif;
                    font-size: 100%;
                    margin: 0;
                    padding: 0;                    
                }
                ${selector} h1 { font-size: 124%; }
                ${selector} h2 { font-size: 118%; }
                ${selector} h3 { font-size: 112%; }
                ${selector} h4 { font-size: 108%; }
                ${selector} h5 { font-size: 104%; }
                ${selector} h6 { font-size: 100%; }
            `);
            
            //Elementos <a>
            styles.push(`
                ${selector} a:not(.no-underline),
                ${selector} .anchor:not(.no-underline) {
                    border-bottom: 1px dotted;
                    padding-bottom: 2px;                    
                }
                ${selector} a,
                ${selector} .anchor {
                    color: ${Util.Drawing.blend(0.2, this.generalTextColor)};
                    cursor: pointer;
                    transition: all 0.3s ease-out;
                }
                ${selector} a:hover,
                ${selector} .anchor:hover {
                    color: ${Util.Drawing.blend(-0.5, this.generalTextColor)};
                }
            `);
            
            //Elemento tipo botão para mostrar diferença quando o mouse passa por cima.
            styles.push(`
                ${selector} button:not(.no-shadow),
                ${selector} .shadow {
                    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.5);
                    position: relative;
                    top: 0;
                }
                ${selector} button:not(.no-shadow):hover,
                ${selector} .shadow:hover {
                    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.6);
                }
                ${selector} button:not(.no-shadow):active,
                ${selector} .shadow:active {
                    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
                    top: 1px;
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
            if (!json || !eval(`!!${json};`)) throw new Core.Errors.NullNotExpected("parse(JSON)");
            return JSON.parse(json) as Colors;
        }
    }
}
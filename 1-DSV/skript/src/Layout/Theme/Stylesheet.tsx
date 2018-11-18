namespace Layout.Theme {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const tips: Core.All;

    /**
     * Conjuntos de propriedades de stylesheet que configuram o layout.
     */
    export class Stylesheet {

        /**
         * Construtor.
         * @param {Colors} colors Tema de cores para configurar o layout.
         */
        public constructor(colors: Colors = tips.data.colors) {
            tips.stylesheet = this;

            this.colors = colors;
            this.zIndex = 1000;
            this.generalTextFont = "'Hind Siliguri', sans-serif";
            this.generalTextColor = Util.Drawing.blend(-0.8, colors.primary);
            this.generalBackground = "#ffffff";
            this.dialogTextFont = "'Raleway', sans-serif";
            this.dialogTitleTextColor = Util.Drawing.blend(-0.8, colors.secondary);
            this.dialogTitleBackground = Util.Drawing.blend(0.8, colors.secondary);
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
         * Valida uma string para retorna como objeto.
         * @param {string} json Dados do json como string.
         * @returns {Translate[]} Objeto.
         */
        public static parse(json: string): Colors {
            return JSON.parse(json) as Colors;
        }
    }
}
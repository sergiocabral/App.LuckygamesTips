namespace Layout.Theme {

    /**
     * Conjuntos de propriedades de stylesheet que configuram o layout.
     */
    export class Stylesheet {

        /**
         * Construtor.
         * @param {Colors} colors Tema de cores para configurar o layout.
         */
        public constructor(colors: Colors) {
            this.colors = colors;
            this.zIndex = 1000;
            this.colorLight = Util.Drawing.LightenDarken(colors.shapes, 80);
            this.colorDark = Util.Drawing.LightenDarken(colors.shapes, -80);
            this.generalTextFont = "'Hind Siliguri', sans-serif";
            this.generalTextColor = colors.generalTextColor;
            this.generalBackground = colors.generalBackground;
            this.dialogTextFont = "'Concert One', cursive";
            this.dialogTitleTextColor = colors.dialogTitleTextColor;
            this.dialogTitleBackground = colors.dialogTitleBackground;
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
         * Cor geral para claros.
         * @type {string}
         */
        public colorLight: string;

        /**
         * Cor geral para escuros.
         * @type {string}
         */
        public colorDark: string;

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
    }
}
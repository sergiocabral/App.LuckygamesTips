namespace Skript.Business.Layout {

    /**
     * Agrupa ações sobre o visual css do sistema.
     */
    export class Theme extends ThemeConfiguration {

        /**
         * Construtor.
         * @param {ThemeConfiguration} configuration Configuração de inicialização.
         */
        public constructor(configuration: ThemeConfiguration) {
            super(configuration);

            this.generalTextFont = "'Hind Siliguri', sans-serif";
            this.generalTextColor = Framework.Util.Drawing.blend(-0.5, this.colors.primary);
            this.generalBackgroundColor = "#ffffff";
            this.dialogTextFont = "'Raleway', sans-serif";
            this.dialogTitleTextColor = Framework.Util.Drawing.blend(-0.5, this.colors.secondary);
            this.dialogTitleBackgroundColor = Framework.Util.Drawing.blend(0.5, this.colors.secondary);
            this.dialogTitleActiveBackgroundColor = this.colors.primary;

            this.stylesheet = new Stylesheet(this);
        }

        /**
         * Ajusta o css dos componentes do sistema.
         * @type {Stylesheet}
         */
        public stylesheet: Stylesheet;

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
         * Fundo do título das janelas de diálogo quando ativas.
         * @type {string}
         */
        public dialogTitleActiveBackgroundColor: string;

        /**
         * Cores padrão para o caso de falha a carga de dados do servidor.
         * @returns {Colors}
         */
        public static defaultColors(): Colors {
            return {
                primary: "#007bff",
                secondary: "#6c7d74",
                positive: "#28a745",
                negative: "#dc3545"
            };
        }
    }
}

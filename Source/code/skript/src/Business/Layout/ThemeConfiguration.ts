namespace Skript.Business.Layout {

    /**
     * Configuração de inicialização da classe.
     */
    export class ThemeConfiguration {

        /**
         * Construtor.
         * @param {ThemeConfiguration} configuration Configuração de inicialização.
         */
        public constructor(configuration: ThemeConfiguration) {
            this.url = configuration.url;
            this.spacing = configuration.spacing;
            this.colors = configuration.colors;
        }

        /**
         * Url do servidor para referências imagens.
         */
        public url: string;

        /**
         * Espaçamento de borda padrão nos elementos.
         */
        public spacing: number;

        /**
         * Cores do tema.
         */
        public colors: Colors;
    }
}

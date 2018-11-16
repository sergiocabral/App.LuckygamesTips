namespace Layout {

    /**
     * Organiza e manipula o layout.
     */
    export class Presentation {

        /**
         * Nome da class CSS que contem todo o layout.
         * @type {string}
         */
        public static className: string = 'luckygamestips';

        /**
         * Construtor.
         * @param {Colors} colors Tema de cores para configurar o layout.
         */
        public constructor(colors: Theme.Colors) {
            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = `${Presentation.className}_${Util.String.random()}`;
            container.className = Presentation.className;

            document.body.appendChild(container);

            Core.Log.History.getInstance().post("Criado container do sistema.", null, Core.Log.Level.Debug, container);

            this.container = container;
            this.colors = colors;
        }

        /**
         * Elemento HTML que contém todos os itens do layout.
         * @type {Element}
         */
        private container: Element;

        /**
         * Tema de cores para configurar o layout.
         * @type {Element}
         */
        private colors: Theme.Colors;

        /**
         * Cria um janela de diálogo.
         * @param {string} title Título
         */
        public createDialog(title: string): void {
            ReactDOM.render(
                React.createElement(Layout.Component.Dialog, { 
                    colors: this.colors, 
                    title: title 
                }, null),
                this.container);
        }
    }
}
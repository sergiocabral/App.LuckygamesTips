namespace Layout {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const all: Core.All;

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
            ReactDOM.render(React.createElement(Layout.Component.Master, { colors: colors }, null), container);

            all.log.post("Criado container do sistema.", null, Core.Log.Level.Debug, container);

            this.container = container;
        }

        /**
         * Elemento HTML que contém todos os itens do layout.
         * @type {Element}
         */
        public container: Element;

        /**
         * Cria um janela de diálogo.
         * @param {string} title Título
         */
        public createDialog(title: string): void {
            window.dispatchEvent(
                new CustomEvent('onCreateDialogDemand',
                    { detail: new Events.Demand.CreateDialogDemand(title) }));
        }
    }
}
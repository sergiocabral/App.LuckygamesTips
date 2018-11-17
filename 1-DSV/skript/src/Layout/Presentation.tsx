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
         */
        public constructor() {
            new PresentationRouter(this);

            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = `${Presentation.className}_${Util.String.random()}`;
            container.className = Presentation.className;
            document.body.appendChild(container);

            this.react = ReactDOM.render(React.createElement(Component.Master), container);

            all.log.post("Criado container do sistema.", null, Core.Log.Level.Debug, container);
        }

        /**
         * Component master do react.
         */
        public react: Component.Master;
    }
}
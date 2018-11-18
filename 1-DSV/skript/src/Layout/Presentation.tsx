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
            all.presentation = this;

            new PresentationDispatcher(this);

            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = Util.String.random();
            container.className = Presentation.className;
            document.body.appendChild(container);
            this.parentContainer = container;

            all.log.post("Criado container do sistema.", null, Core.Log.Level.Debug, container);

            ReactDOM.render(
                React.createElement(Component.ButtonActivator, null, null), 
                this.createContainer());
        }

        /**
         * Container para todo HTML do sistema.
         */
        public parentContainer: HTMLElement;

        /**
         * Cria um container para receber um componente independente.
         * @returns {HTMLElement} Container criado.
         */
        public createContainer(): HTMLElement {
            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = Util.String.random();
            all.presentation.parentContainer.appendChild(container);
            return container;
        }
    }
}
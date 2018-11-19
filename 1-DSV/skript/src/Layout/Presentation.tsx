namespace Skript.Layout {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

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
            skript.presentation = this;

            new PresentationDispatcher(this);

            new Theme.Stylesheet();

            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = Util.String.random();
            container.className = Presentation.className;
            document.body.appendChild(container);
            this.parentContainer = container;

            skript.log.post("Criado container do sistema.", null, Core.Log.Level.Debug, container);
                
            ReactDOM.render(
                React.createElement(ReactJs.Component.ButtonActivator, null, null), 
                this.createContainer());

            this.mainDialog = Core.Bus.MessageDispatcher.Send(
                new Message.DialogCreate(
                    skript.configuration.name, 
                    ReactJs.Component.DialogCloseMode.Hide, 
                    <p>Main Windows</p>)).result as ReactJs.Component.Dialog;
            this.mainDialog.visible(false);
        }

        /**
         * Container para todo HTML do sistema.
         */
        public parentContainer: HTMLElement;

        /**
         * Instância da janela principal do sistema.
         */
        public mainDialog: ReactJs.Component.Dialog;

        /**
         * Cria um container para receber um componente independente.
         * @returns {HTMLElement} Container criado.
         */
        public createContainer(): HTMLElement {
            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = Util.String.random();
            skript.presentation.parentContainer.appendChild(container);
            return container;
        }
    }
}
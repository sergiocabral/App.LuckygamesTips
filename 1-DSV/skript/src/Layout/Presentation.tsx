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
            skript.presentation = skript.presentation ? skript.presentation : this;

            new PresentationBus(this);

            new Theme.Stylesheet();

            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = Util.String.random();
            container.className = Presentation.className;
            document.body.appendChild(container);
            this.parentContainer = container;

            skript.log.post("Created system container.", null, Core.Log.Level.Debug, container);
                
            ReactDOM.render(
                React.createElement(ReactJs.Component.ButtonActivator, null, null), 
                this.createContainer());

            this.mainDialog = 
                new Message.DialogCreate(
                    skript.configuration.name, 
                    ReactJs.Component.DialogCloseMode.Hide).send().result as ReactJs.Component.Dialog;
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

        /**
         * Cria uma janela de di[alogo.]
         * @param {ReactJs.Component.DialogProps} config Configuração inicial.
         * @param {any} children Conteúdo da janela.
         */
        public createDialog(config: ReactJs.Component.DialogProps, children: any): ReactJs.Component.Dialog {
            return ReactDOM.render(
                React.createElement(ReactJs.Component.Dialog, config, children), 
                skript.presentation.createContainer());
        }
        
        /**
         * Adiciona um componente.
         * @param {React.ReactNode} children Conteúdo.
         */
        public appendToMainDialog(children: React.ReactNode): void { 
            if (children) this.mainDialog.append(children);
        }
    }
}
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
                
            this.showMessages = ReactDOM.render(
                React.createElement(ReactJs.Component.ShowMessages, null, null), 
                this.createContainer());

            this.mainDialog = 
                new Message.DialogCreate(
                    skript.configuration.name, 
                    ReactJs.Component.DialogCloseMode.Hide,
                    undefined,
                    Math.trunc((document.documentElement as any).offsetWidth * 0.6),
                    Math.trunc((document.documentElement as any).offsetHeight * 0.6)).send().result as ReactJs.Component.Dialog;
            this.mainDialog.visible(false);
        }

        /**
         * Container para todo HTML do sistema.
         */
        private parentContainer: HTMLElement;

        /**
         * Instância do exibidor de mensagens ao usuário.
         */
        private showMessages: ReactJs.Component.ShowMessages;

        /**
         * Instância da janela principal do sistema.
         */
        private mainDialog: ReactJs.Component.Dialog;

        /**
         * Cria um container para receber um componente independente.
         * @returns {HTMLElement} Container criado.
         */
        private createContainer(): HTMLElement {
            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = Util.String.random();
            skript.presentation.parentContainer.appendChild(container);
            return container;
        }

        /**
         * Define a exibição da janela.
         * Quando nenhum parâmetro é informado apenas retorna a informação.
         * @param {boolean} mode Opcional. Exibe ou esconde.
         * @returns {boolean} Retorna o estado de exibição da janela.
         */
        public mainDialogVisible(mode?: boolean): boolean {
            return this.mainDialog.visible(mode);
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

        /**
         * Exibe uma mensagem ao usuário
         * @param {string} text Texto.
         * @param {Level} level Nível do log.
         */
        public message(text: string, level: Core.Log.Level = Core.Log.Level.Information): void {
            this.showMessages.post({
                text: text,
                level: level,
                time: new Date()
            });
        }
    }
}
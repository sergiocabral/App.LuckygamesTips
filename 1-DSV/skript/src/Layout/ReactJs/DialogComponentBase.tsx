namespace Skript.Layout.ReactJs {

    /**
     * Botão que ativa o sistema.
     */
    export abstract class DialogComponentBase<P, S> extends ComponentBase<P, S> {

        /**
         * Construtor.
         * @param {P} props Propriedades.
         */
        public constructor(props: P) {
            super(props);           
            
            this.onNewWindow = this.onNewWindow.bind(this);
        }

        /**
         * Título da seção.
         * @type {string}
         */
        protected title: string = "";

        /**
         * Ícone. Formato do FontAwesome.
         * @type {string}
         */
        protected icon: string = "";

        /**
         * Ativa a possibilidade de destacar a janela.
         * @type {boolean}
         */
        protected newWindow: boolean = true;

        /**
         * Dimensão padrão da janela.
         * @type {Core.Size|undefined}
         */
        protected newWindowSize: Core.Size|undefined = undefined;

        /**
         * Id para o conteúdo.
         * @type {() => string}
         */
        private idContent: () => string = () => "c" + this.id();

        /**
         * Id para a janela criada.
         * @type {() => string}
         */
        private idWindow: () => string = () => "w" + this.id();

        /**
         * Ao mover para nova janela.
         */
        private onNewWindow() {
            const dialog = new Message.DialogCreate(
                this.title, 
                ReactJs.Component.DialogCloseMode.Remove,
                this.icon,
                <div id={this.idWindow()}></div>,
                this.newWindowSize).sendSync().result as ReactJs.Component.Dialog;
           
            const component = document.querySelector(`#${this.id()}`) as HTMLElement;
            const content = document.querySelector(`#${this.idContent()}`) as HTMLElement;
            const contentParent = content.parentElement as HTMLElement;
            const window = document.querySelector(`#${this.idWindow()}`) as HTMLElement;
            
            component.style.display = "none";
            window.appendChild(content);

            dialog.onClose.push(() => {
                contentParent.appendChild(content);
                component.style.display = "";
            });

            dialog.visible(true);
        }
        
        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className}>
                    <Layout.ReactJs.Component.Container 
                        title={this.title} 
                        icon={this.icon} 
                        collapse={true}
                        onNewWindow={this.newWindow ? this.onNewWindow : undefined}>
                        <div id={this.idContent()}>
                            {this.renderContent()}
                        </div>
                    </Layout.ReactJs.Component.Container>                    
                </div>
            );
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected abstract renderContent(): JSX.Element;
        
    }
}

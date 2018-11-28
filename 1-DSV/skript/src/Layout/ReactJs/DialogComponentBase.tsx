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
            
            this.elContainer = React.createRef();
            this.elContent = React.createRef();

            this.onNewWindow = this.onNewWindow.bind(this);
        }

        /**
         * Container.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContainer: React.RefObject<HTMLDivElement>;

        /**
         * Conteúdo do componente.
         * @type {React.RefObject<Layout.ReactJs.Component.Container>}
         */
        private elContent: React.RefObject<Layout.ReactJs.Component.Container>;

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
         * Ao mover para nova janela.
         */
        private onNewWindow() {
            //const container = this.elContainer.current as HTMLElement;
            //const content = this.elContent.current as Layout.ReactJs.Component.Container;

            const dialog = new Message.DialogCreate(
                this.title, 
                ReactJs.Component.DialogCloseMode.Remove,
                this.icon,
                "content",
                this.newWindowSize).sendSync().result as ReactJs.Component.Dialog;
            dialog.visible(true);
        }
        
        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className} ref={this.elContainer}>
                    <Layout.ReactJs.Component.Container 
                        ref={this.elContent}
                        title={this.title} 
                        icon={this.icon} 
                        collapse={true}
                        onNewWindow={this.newWindow ? this.onNewWindow : undefined}>
                        {this.renderContent()}
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

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
         * Ao mover para nova janela.
         */
        private onNewWindow() {
            this.toast("onNewWindow");
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

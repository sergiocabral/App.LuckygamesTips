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
         * Dimensão padrão da janela.
         * @type {Core.Size|undefined}
         */
        protected dialogSize: Core.Size|undefined = undefined;
        
        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <Layout.ReactJs.Component.HeaderContainer 
                    title={this.title} 
                    icon={this.icon} 
                    collapsible={true}
                    dialog={true}
                    dialogSize={this.dialogSize}>
                    {this.renderContent()}
                </Layout.ReactJs.Component.HeaderContainer>                    
            );
        }

        /**
         * Aplicado quando não tem janela. Seletor CSS mais alto que engloba o componente.
         * @type {() => string}
         */
        protected selectorOutDialog: () => string = () => `.${Presentation.className} .${Layout.ReactJs.Component.HeaderContainer.classNameInDialog()} .${this.className()}[id]`;

        /**
         * Aplicado quando está na janela. Seletor CSS mais alto que engloba o componente.
         * @type {() => string}
         */
        protected selectorInDialog: () => string = () => `.${Presentation.className} .${Layout.ReactJs.Component.HeaderContainer.classNameOutDialog()} .${this.className()}[id]`;

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected abstract renderContent(): JSX.Element;
        
    }
}

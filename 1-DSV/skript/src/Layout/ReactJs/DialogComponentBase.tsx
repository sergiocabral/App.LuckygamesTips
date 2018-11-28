namespace Skript.Layout.ReactJs {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

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
         * Referência para a janela deste componente.
         * @type {ReactJs.Component.Dialog|undefined}
         */
        private dialog: ReactJs.Component.Dialog|undefined;

        /**
         * Ao mover para nova janela.
         */
        private onNewWindow() {
            if (!this.dialog) {
                this.dialog = new Message.DialogCreate(
                    this.title, 
                    ReactJs.Component.DialogCloseMode.Hide,
                    this.icon,
                    <div id={this.idWindow()}></div>,
                    this.newWindowSize).sendSync().result as ReactJs.Component.Dialog;

                this.dialog.onClose.push(() => {
                    elements.contentParent.appendChild(elements.content);
                    elements.component.style.display = "";
                    skript.log.post("Closed window: {0}", this.title, Core.Log.Level.DebugDOM, elements);
                });
            } else {
                this.dialog.bring();
            }
           
            const elements: {
                component: HTMLElement,
                content: HTMLElement,
                contentParent: HTMLElement,
                dialog: HTMLElement
            } = { 
                component: document.querySelector(`#${this.id()}`) as HTMLElement,
                content: document.querySelector(`#${this.idContent()}`) as HTMLElement,
                contentParent: (document.querySelector(`#${this.idContent()}`) as HTMLElement).parentElement as HTMLElement,
                dialog: document.querySelector(`#${this.idWindow()}`) as HTMLElement
            };
            
            elements.component.style.display = "none";
            elements.dialog.appendChild(elements.content);
            skript.log.post("Open window: {0}", this.title, Core.Log.Level.DebugDOM, elements);            

            this.dialog.visible(true);
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

namespace Skript.Framework.Layout.Components.DialogHeader {
    
    /**
     * Botão que ativa o sistema.
     */
    export abstract class Content<TProps extends EmptyProps = EmptyProps, TState extends EmptyState = EmptyState> extends Base<TProps, TState> {

        /**
         * Construtor.
         * @param {TProps} props Propriedades.
         */
        public constructor(props: TProps) {
            super(props);
            this.onResize = this.onResize.bind(this);
            this.elDialogHeader = React.createRef();
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
         * @type {Types.Size|undefined}
         */
        protected dialogSize: Types.Size|undefined = undefined;
        
        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <DialogHeader
                    ref={this.elDialogHeader}
                    title={this.title.translate()} 
                    icon={this.icon} 
                    collapsible={true}
                    dialog={true}
                    dialogSize={this.dialogSize}
                    onResize={this.onResize}>
                    {this.renderContent()}
                </DialogHeader>                    
            );
        }

        /**
         * Elemento responsável por mover entre as janelas.
         * @type {React.RefObject<DialogHeader>}
         */
        protected elDialogHeader: React.RefObject<DialogHeader>;

        /**
         * Aplicado quando não tem janela. Seletor CSS mais alto que engloba o componente.
         * @returns {string} Seletor CSS.
         */
        protected classNameSelectorInDialog() { 
            if (!this.elDialogHeader.current) throw new Errors.EmptyValue("elDialogHeader.current");
            return `.${Core.Main.instance.presentation.configuration.className} .${this.elDialogHeader.current.classNameInDialog} .${this.className}[id]`; 
        }

        /**
         * Aplicado quando está na janela. Seletor CSS mais alto que engloba o componente.
         * @returns {string} Seletor CSS.
         */
        protected classNameSelectorOutDialog() { 
            if (!this.elDialogHeader.current) throw new Errors.EmptyValue("elDialogHeader.current");
            return `.${Core.Main.instance.presentation.configuration.className} .${this.elDialogHeader.current.classNameOutDialog} .${this.className}[id]`;
        }

        /**
         * Função chamada sempre que redimensionar.
         * @type {() => void}
         */
        protected onResize(): void { };

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected abstract renderContent(): JSX.Element;
        
    }
}

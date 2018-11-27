namespace Skript.Layout.ReactJs.Component {

    /**
     * Conjunto de dados props para este compoenente.
     */
    type ContainerProps = {

        /**
         * Título.
         * @type {string}
         */
        title?: string,

        /**
         * Ícone. Opcional.
         * @type {string}
         */
        icon?: string,

        /**
         * Indica se deve haver evento de colapsar.
         * @type {boolean}
         */
        collapse?: boolean

        /**
         * Indica se deve haver evento para nova janela.
         * @type {boolean}
         */
        newWindow?: boolean
    }

    /**
     * Cabeçalho de título.
     */
    export class Container extends ComponentBase<ContainerProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} > .title {
                background-color: ${this.theme.dialogTitleBackground};
                color: ${this.theme.dialogTitleTextColor};
                border-radius: 4px;
                padding: 5px 10px;
                margin: 0 -10px;
            }
            ${this.selector()} > .title .text .graph {
                float: left;
                margin-right: 8px;
            }
            ${this.selector()} > .title .text h1 {
                font-family: 'Raleway', sans-serif;
                white-space: nowrap;                
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 2px 0;
                width: calc(100% - 60px);
            }
            ${this.selector()} > .title .window {
                float: right;
            }
            ${this.selector()} > .content {
                padding: 7px 0;
                transition: max-height 0.25s linear;
                overflow: hidden;                
            }
            ${this.selector()} > .content.hide {
                max-height: 0 !important;
            }
        </div>            
        `;

        /**
         * Construtor.
         * @param {ContainerProps} props Propriedades.
         */
        public constructor(props: ContainerProps) {
            super(props);

            this.elContent = React.createRef();

            this.isMainWindow = true;

            this.onCollapseClick = this.onCollapseClick.bind(this);
            this.onNewWindowClick = this.onNewWindowClick.bind(this);            
        }

        /**
         * Conteúdo.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContent: React.RefObject<HTMLDivElement>;

        /**
         * Determina se este container está na janela principal.
         */
        private isMainWindow: boolean;

        /**
         * Quando o botão é pressionado.
         */
        private onCollapseClick() {
            const container = this.elContent.current as HTMLElement;
            if (container.classList.contains("hide")) {
                container.classList.remove("hide");
                setTimeout(() => container.style.maxHeight = "", 300 /* tempo da animação */);
            }
            else {
                container.style.maxHeight = container.offsetHeight + "px";
                setTimeout(() => container.classList.add("hide"), 1);
            }
        }

        /**
         * Quando o botão é pressionado.
         */
        private onNewWindowClick() {
            this.toast("onNewWindowClick");
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className}>
                    <div className="title" style={ { display: this.props.title ? "inherit" : "none" } }>
                        <span 
                            title={this.isMainWindow ? this.translate("Open in new window") : this.translate("Return to main window")}
                            className="anchor window no-underline" 
                            style={ { display: this.props.newWindow ? "inherit" : "none" } } 
                            onClick={this.props.newWindow ? this.onNewWindowClick : undefined}>
                            <i className="far fa-window-restore"></i>
                        </span>
                        <span className={(this.props.collapse ? "anchor " : "") + "text no-underline"} onClick={this.props.collapse ? this.onCollapseClick : undefined}>
                            <span className="graph"><i className={"fas " + (this.props.icon ? this.props.icon : "fa-cogs")}></i></span>
                            <h1>{this.props.title}</h1>
                        </span>
                    </div>
                    <div className="content" ref={this.elContent}>
                        {this.props.children}
                    </div>
                </div>
            );
        }
    }
}

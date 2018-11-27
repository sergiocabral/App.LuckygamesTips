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
            ${this.selector()} .title {
                background-color: ${this.theme.dialogTitleBackground};
                color: ${this.theme.dialogTitleTextColor};
                border-radius: 4px;
                padding: 5px 10px;
                margin: 0 -10px;
            }
            ${this.selector()} .title .text .graph {
                float: left;
            }
            ${this.selector()} .title .text h1 {
                font-family: 'Raleway', sans-serif;
                white-space: nowrap;                
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 2px 0 2px 18px;
                width: calc(100% - 50px);
            }
            ${this.selector()} .title .window {
                float: right;
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

            this.onCollapseClick = this.onCollapseClick.bind(this);
            this.onNewWindowClick = this.onNewWindowClick.bind(this);            
        }

        /**
         * Conteúdo.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContent: React.RefObject<HTMLDivElement>;

        /**
         * Quando o botão é pressionado.
         * @param ev Informações do evento.
         */
        private onCollapseClick(ev: any) {
            ev.preventDefault();
            this.toast("onCollapseClick");
        }

        /**
         * Quando o botão é pressionado.
         * @param ev Informações do evento.
         */
        private onNewWindowClick(ev: any) {
            ev.preventDefault();
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
                        <span className="anchor window no-underline" style={ { display: this.props.newWindow ? "inherit" : "none" } } onClick={this.props.newWindow ? this.onNewWindowClick : undefined}>
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

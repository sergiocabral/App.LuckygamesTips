namespace Layout.ReactJs.Component {
    
    /**
     * Tipo para props do React deste componente.
     */
    type Props = {

        /**
         * Título da janela de diálogo.
         */
        title: string
    }

    /**
     * Janela base que contem outros componentes.
     */
    export class Dialog extends ComponentBase<Props, Partial<EmptyState>> {

        /**
         * Nome da classe CSS deste componente.
         */
        public className: string = 'dialog';

        private defaults: { width: number, height: number } = { 
            width: 50,
            height: 200
        };

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} {
                z-index: ${this.theme.zIndex};
                background: ${this.theme.generalBackground};
                box-shadow: 0 0 20px black;
                border-radius: 7px;
                position: fixed;
                left: calc(50% - ${this.defaults.width / 2}px);
                top: calc(50% - ${this.defaults.height / 2}px);
                min-width: 200px;
                min-height: 100px;
                width: ${this.defaults.width}px;
                height: ${this.defaults.height}px;
            }
            ${this.selector()} .header {
                background-color: ${this.theme.dialogTitleBackground};
                border-bottom: 1px solid ${Util.Drawing.blend(0.8, this.theme.dialogTitleTextColor)};
                border-radius: 7px 7px 0 0;
                padding: 9px 0 8px 0;
                cursor: pointer;
                position: relative;
            }
            ${this.selector()} .header h1 {
                color: ${this.theme.dialogTitleTextColor};
                font-family: ${this.theme.dialogTextFont};
                white-space: nowrap;
                margin: 0 10px;                
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 85%;
            }
            ${this.selector()} .header .icon {
                color: ${this.theme.dialogTitleTextColor};
                font-size: 20px;
                float: left;
                margin: -3px 9px 0 11px;
                opacity: 1;
            }
            ${this.selector()} .header a.close {
                color: ${Util.Drawing.blend(0.3, this.theme.dialogTitleTextColor)};
                position: absolute;
                right: 13px;
                top: 12px;
                font-size: 13px;
            }
            ${this.selector()} .header a.close:hover {
                color: ${this.theme.dialogTitleTextColor};
            }
            ${this.selector()} .content * {
                margin: 5px 10px;
            }
            ${this.selector()} .content * {
                font-family: ${this.theme.generalTextFont};
                font-size: 14px;              
            }
            ${this.selector()} .content > * {
                margin-left: 10px;
                margin-right: 10px;
            }
            ${this.selector()} .content > *:first-child {
                margin-top: 5px;
            }  
            ${this.selector()} .content > *:last-child {
                margin-bottom: 5px;
            }
            ${this.selector()} .resize {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 15px;
                overflow: hidden;
                background: ${this.theme.generalBackground};
            }
            ${this.selector()} .resize div {
                width: 20px;
                height: 20px;
                background-color: ${Util.Drawing.blend(0.5, this.theme.generalTextColor)};
                float: right;
                transform: rotate(45deg);
                position: relative;
                top: 10px;
                left: 10px;
                cursor: nw-resize;
                transition: opacity 0.5s linear;
                opacity: 0.5;
            }          
            ${this.selector()} .resize div:hover {
                opacity: 1;
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);

            this.elContainer = React.createRef();
            this.elTitle = React.createRef();
            this.elResize = React.createRef();

            this.onCloseClick = this.onCloseClick.bind(this);
        }

        /**
         * Referência ao container pai de todos.
         * @type {React.RefObject<HTMLElement>}
         */
        private elContainer: React.RefObject<HTMLElement>;

        /**
         * Referência para o título na barra.
         * @type {React.RefObject<HTMLElement>}
         */
        private elTitle: React.RefObject<HTMLElement>;

        /**
         * Referência para o botão de resize.
         * @type {React.RefObject<HTMLElement>}
         */
        private elResize: React.RefObject<HTMLElement>;

        /**
         * Ajusta o título para sempre caber ma barra.
         */
        private adjustTitleWidth(): void {
            const elContainer = this.elContainer.current as HTMLElement;
            const elTitle = this.elTitle.current as HTMLElement;
            elTitle.style.width = (elContainer.clientWidth - 80) + "px";
        }

        /**
         * Quando o botão de fecha é clicado.
         */
        private onCloseClick(): void {
            const component = this.elContainer.current as HTMLElement;
            const container = component.parentNode as HTMLElement;
            ReactDOM.unmountComponentAtNode(container);
            container.remove();
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <div id={Util.String.random()} className={this.className} ref={this.elContainer as any}>
                    <div className="header">
                        <span className="icon"><i className="fas fa-robot"></i></span>
                        <h1 ref={this.elTitle as any}>{this.props.title}</h1>
                        <a href="#" className="close" onClick={this.onCloseClick}><i className="fas fa-times"></i></a>
                    </div>
                    <div className="content">
                        <p>Dialog...</p>
                    </div>  
                    <div className="resize"><div ref={this.elResize as any}>&nbsp;</div></div>
                </div>
            );
        }

        /**
         * Quando o componente é montado.
         */
        public componentDidMount(): void {
            new MoveAndResize({ 
                owner: this,
                elContainer: this.elContainer.current as HTMLElement,
                elMove: [this.elTitle.current as HTMLElement],
                elResize: [this.elResize.current as HTMLElement],
                onResize: this.onResize
            });
            setTimeout(() => this.adjustTitleWidth(), 1);
        }

        /**
         * Quando o componente é redimensionado.
         */
        public onResize() {
            this.adjustTitleWidth();
        }
    }
}

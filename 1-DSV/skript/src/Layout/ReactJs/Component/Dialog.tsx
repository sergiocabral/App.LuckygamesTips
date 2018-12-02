namespace Skript.Layout.ReactJs.Component {

    /**
     * Modos de fechamento da janela.
     */
    export enum DialogCloseMode {

        /**
         * Usa CSS para esconder.
         */
        Hide,

        /**
         * Remove do DOM.
         */
        Remove
    }

    /**
     * Tipo para props do React deste componente.
     */
    export class DialogProps extends Layout.ReactJs.EmptyProps {

        /**
         * Título da janela.
         * @type {string}
         */
        title: string = "Dialog title here";

        /**
         * Ícone da janela. Formato FontAwesome.
         * @type {string}
         */
        icon?: string;

        /**
         * Modo de fechamento da janela.
         * @type {DialogCloseMode}
         */
        closeMode: DialogCloseMode = DialogCloseMode.Remove;

        /**
         * Dimensão.
         * @type {Core.Size}
         */
        size?: Core.Size;

        /**
         * Posição.
         * @type {Core.Position}
         */
        position?: Core.Position;
    }

    /**
     * Tipo para state do React deste componente.
     */
    export type DialogState = {

        /**
         * Conteúdo
         * @type {React.ReactNode[]}
         */
        children: React.ReactNode[]
    }
    
    /**
     * Janela base que contem outros componentes.
     */
    export class Dialog extends ComponentBase<DialogProps, Partial<DialogState>> {
        
        private defaults: Core.Size = { 
            width: 500,
            height: 250
        };

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                z-index: ${this.theme.zIndex * 0.9};                
                box-shadow: 0 0 20px black;
                border-radius: 7px;
                overflow: hidden;
                position: fixed;
                left: calc(50% - ${this.defaults.width / 2}px);
                top: calc(50% - ${this.defaults.height / 2}px);
                min-width: 200px;
                min-height: 100px;
                width: ${this.defaults.width}px;
                height: ${this.defaults.height}px;
            }
            ${this.selector()} > .header {
                background-color: ${this.theme.dialogTitleBackgroundColor};
                border-bottom: 1px solid ${Util.Drawing.blend(0.5, this.theme.dialogTitleTextColor)};
                border-radius: 7px 7px 0 0;
                padding: 9px 0 8px 0;
                cursor: pointer;
                position: relative;
                text-shadow: 0 0 5px ${Util.Drawing.blend(0.9, this.theme.dialogTitleBackgroundColor)};
            }
            ${this.selector()} > .header h1 {
                color: ${this.theme.dialogTitleTextColor};
                font-family: ${this.theme.dialogTextFont};
                white-space: nowrap;
                margin: 1px ${this.theme.spacing}px -1px ${this.theme.spacing}px;                
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 85%;
            }
            ${this.selector()} > .header .graph {
                color: ${this.theme.dialogTitleTextColor};
                font-size: 20px;
                float: left;
                margin: -4px 9px 0 11px;
                opacity: 1;
            }
            ${this.selector()} > .header a.close {
                color: ${Util.Drawing.blend(0.10, this.theme.dialogTitleTextColor)};
                position: absolute;
                right: 13px;
                top: 10px;
                font-size: 13px;
                border-bottom: none;
                text-transform: none;
            }
            ${this.selector()} > .header a.close:hover {
                color: ${Util.Drawing.blend(-0.10, this.theme.dialogTitleTextColor)};
            }
            ${this.selector()} > .content {
                background: rgba(255, 255, 255, 0.95);
                height: calc(100% - 50px);
                overflow: auto;
                overflow-x: hidden;
                position: relative;
            }
            ${this.selector()} > .resize {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 100%;
                overflow: hidden;
                background-color: ${Util.Drawing.blend(0.2, this.theme.dialogTitleBackgroundColor)};
                border-top: 1px solid ${Util.Drawing.blend(0.5, this.theme.dialogTitleTextColor)};
            }
            ${this.selector()} > .resize div {
                background-color: transparent;
                float: right;
                width: 20px;
                height: 10px;
                cursor: nw-resize;
            }
            ${this.selector()} > .header,
            ${this.selector()} > .resize {
                opacity: 0.9;
                background-image: url("https://dsv.luckygames.tips/media/dialog-background.jpg");
                background-size: cover;
                background-position: 0 0;
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: DialogProps) {
            super(props);

            this.state = { children: [this.props.children] };

            this.elContainer = React.createRef();
            this.elTitle = React.createRef();
            this.elResize = React.createRef();

            this.close = this.close.bind(this);

            this.myMessageBus.push(new DialogBus(this));
        }
        
        /**
         * Referência ao container pai de todos.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContainer: React.RefObject<HTMLDivElement>;
        
        /**
         * Referência para o título na barra.
         * @type {React.RefObject<HTMLHeadingElement>}
         */
        private elTitle: React.RefObject<HTMLHeadingElement>;

        /**
         * Referência para o botão de resize.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elResize: React.RefObject<HTMLDivElement>;

        /**
         * Implementa a exibição/esconder suave do elemento.
         * @type {Visibility}
         */
        private visibility?: Visibility;

        /**
         * Ajusta o título para sempre caber ma barra.
         */
        private adjustTitleWidth(): void {
            const elContainer = this.elContainer.current as HTMLElement;
            const elTitle = this.elTitle.current as HTMLElement;
            elTitle.style.width = (elContainer.clientWidth - 80) + "px";
        }

        /**
         * Lista de funções chamadas ao fechar a janela.
         */
        public onClose: ((mode: DialogCloseMode) => void)[] = [];

        /**
         * Abre a janela.
         * @returns {Dialog} Auto referência.
         */
        public open(): Dialog {
            this.visible(true);
            return this;
        }

        /**
         * Fecha a janela.
         * @returns {Dialog} Auto referência.
         */
        public close(): Dialog {
            const component = this.elContainer.current as HTMLElement;
            const container = component.parentNode as HTMLElement;

            for (const index in this.onClose) this.onClose[index](this.props.closeMode);
            
            switch (this.props.closeMode) {
                case DialogCloseMode.Hide:
                    this.visible(false);
                    setTimeout(() => { if (!this.visible()) this.bring(Util.BringTo.Back); }, this.visibility ? this.visibility.fade() : 0);
                    break;
                case DialogCloseMode.Remove:
                    this.visible(false);
                    setTimeout(() => {
                        ReactDOM.unmountComponentAtNode(container);
                        container.remove();
                    }, (this.visibility as Visibility).fade() * 1000 + 500);
                    break;
            }
            
            return this;
        }

        /**
         * Define a exibição da janela.
         * Quando nenhum parâmetro é informado apenas retorna a informação.
         * @param {boolean} mode Opcional. Exibe ou esconde.
         * @returns {boolean} Retorna o estado de exibição da janela.
         */
        public visible(mode?: boolean): boolean {
            return (this.visibility as Visibility).visible(mode);
        }
        
        /**
         * Usada para acumular comandos append e enviá-los de uma única vez depois de alguns milissegundos.
         * @type {React.ReactNode[]}
         */
        private appendDelay: React.ReactNode[] = [];
        
        /**
         * Id do timeout que irá processar a lista appendDelay. 
         * @type {number}
         */
        private appendIdTimeout: number = 0;

        /**
         * Adiciona conteúdo na janela.
         * @param {React.ReactNode} children Conteúdo.
         */
        public append(children: React.ReactNode): void {
            const delay = 100;
            clearTimeout(this.appendIdTimeout);
            this.appendDelay.push(children);

            this.appendIdTimeout = setTimeout(() => { 
                skript.log.post(`Added to Dialog \"{title}\": {count} itens.`, { title: this.props.title, count: this.appendDelay.length }, Core.Log.Level.DebugReact);
                this.setState({ children: (this.state.children as React.ReactNode[]).concat(this.appendDelay) });
                this.appendDelay.length = 0;
            }, delay) as any;
        }

        /**
         * Move a janela de diálogo pra frente ou pra trás das outras.
         * @param {BringTo} to Optional. Direção. 
         * @returns {Dialog} Auto referência.
         */
        public bring(to: Util.BringTo = Util.BringTo.Front): Dialog {
            Util.DOM.bring((this.elContainer.current as HTMLElement).parentElement as HTMLElement, to);
            return this;
        }
        
        /**
         * Processa teclas de atalho.
         * @param {KeyboardEvent} evt Informações sobre o evento;
         * @returns {boolean} Retorna true se foi processado.
         */
        public shortcut(evt: KeyboardEvent): boolean {
            if (evt.keyCode === 27 && 
                this.elContainer.current &&
                this.elContainer.current.parentElement &&
                this.visible() &&
                Util.DOM.isBring(this.elContainer.current.parentElement, Util.BringTo.Front)) {
                    this.close();
                    return true;
            }
            return false;                
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <div id={this.id()} className={this.className()} ref={this.elContainer}>
                    <div className="header">
                        <span className="graph"><i className={this.props.icon ? this.props.icon : "fas fa-cog"}></i></span>
                        <h1 ref={this.elTitle}>{this.props.title}</h1>
                        <a href="#" className="close dialog-action" onClick={this.close}><i className="fas fa-times"></i></a>
                    </div>
                    <div className="content">
                        {(this.state.children as React.ReactNode[]).map(child => !child ? "" : <div key={Util.String.random()}>{child}</div>)}
                    </div>  
                    <div className="resize"><div ref={this.elResize}>&nbsp;</div></div>
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
                onResize: this.onResize,
                ignoreEventClick: this.ignoreEventClick
            });
            setTimeout(() => this.adjustTitleWidth(), 1);

            this.visibility = new Visibility({ element: this.elContainer.current as HTMLElement });

            (this.elContainer.current as any).style.minWidth = `450px`;
            if (this.props.size && this.props.size.width > 0) {
                (this.elContainer.current as any).style.width = `${this.props.size.width}px`;
                (this.elContainer.current as any).style.left = `calc(50% - ${this.props.size.width / 2}px)`;
            }
            (this.elContainer.current as any).style.minHeight = `250px`;
            if (this.props.size && this.props.size.height > 0) { 
                (this.elContainer.current as any).style.height = `${this.props.size.height}px`;
                (this.elContainer.current as any).style.top = `calc(50% - ${this.props.size.height / 2}px)`;
            }

            if (this.props.position && this.props.position.x > 0) { 
                (this.elContainer.current as any).style.left = `${this.props.position.x}px`;
            }
            if (this.props.position && this.props.position.y > 0) { 
                (this.elContainer.current as any).style.top = `${this.props.position.y}px`;
            }
        }

        /**
         * Ignora o evento de clica se o botão clicado foi para fechar a janela.
         */
        private ignoreEventClick(evt: any) {
            return evt.target.className === "close" || (evt.target.parentElement && evt.target.parentElement.className === "close");
        }

        /**
         * Quando o componente é redimensionado.
         */
        private onResize() {
            this.adjustTitleWidth();
        }
    }
}

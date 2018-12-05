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

        /**
         * Função chamada sempre que redimensionar.
         * @type {() => void}
         */
        onResize?: () => void;
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
                cursor: pointer;
                position: relative;
                text-shadow: 0 0 5px ${Util.Drawing.blend(0.9, this.theme.dialogTitleBackgroundColor)};
            }
            ${this.selector()} > .header > div {
                padding: 9px 0 8px 0;
            }
            .${this.classNameBase} > *:last-child > .${this.myClassName} > .header > div {
                
                background-image: linear-gradient(rgba(${Util.Drawing.rgb(this.theme.dialogTitleActiveBackgroundColor)},0.2), transparent);
            }
            ${this.selector()} > .header h1 {
                color: ${this.theme.dialogTitleTextColor};
                font-family: ${this.theme.dialogTextFont};
                white-space: nowrap;
                margin: 1px ${this.theme.spacing}px -1px ${this.theme.spacing}px;                
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                width: calc(100% - 110px);
            }
            ${this.selector()} > .header .graph {
                color: ${this.theme.dialogTitleTextColor};
                font-size: 20px;
                float: left;
                margin: -4px 9px 0 11px;
                opacity: 1;
            }
            ${this.selector()} > .header a.dialog-action {
                color: ${Util.Drawing.blend(0.10, this.theme.dialogTitleTextColor)};
                font-size: 13px;
                border-bottom: none;
                text-transform: none;
                display: inline-block;
                margin: 1px 15px 0 3px;
                float: right;
            }
            ${this.selector()} > .header a.dialog-action:hover {
                color: ${Util.Drawing.blend(-0.10, this.theme.dialogTitleTextColor)};
            }
            ${this.selector()}.maximized > .header a.maximize {
                display: none;
            }
            ${this.selector()}:not(.maximized) > .header a.restore {
                display: none;
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
            }
            ${this.selector()}:not(.maximized) > .resize div {
                cursor: nw-resize;
            }
            ${this.selector()} > .header,
            ${this.selector()} > .resize {
                opacity: 0.9;
                background-image: url("https://dsv.luckygames.tips/media/dialog-background.png");
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

            this.onResize = this.onResize.bind(this);
            this.close = this.close.bind(this);
            this.maximize = this.maximize.bind(this);
            this.restore = this.restore.bind(this);

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
         * Implementa move e redimensionar o elemento.
         * @type {MoveAndResize}
         */
        private moveAndResize?: MoveAndResize;

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
         * Informações sobre o posicionamento e dimensão da janela antes de maximizar.
         * @type {Core.SizeAndPosition}
         */
        private lastDialogState?: Core.SizeAndPosition;

        /**
         * Maximiza a janela
         * @returns {Dialog} Auto referência.
         */
        public maximize(): Dialog {
            if (!this.moveAndResize || !this.elContainer.current) return this;
            this.lastDialogState = {
                position: {
                    x: this.elContainer.current.offsetLeft,
                    y: this.elContainer.current.offsetTop
                },
                size: {
                    width: this.elContainer.current.offsetWidth,
                    height: this.elContainer.current.offsetHeight
                }
            };
            this.elContainer.current.style.left = `${this.theme.spacing * 2}px`;
            this.elContainer.current.style.top = `${this.theme.spacing * 2}px`;
            this.elContainer.current.style.width = `${window.innerWidth - this.theme.spacing * 5}px`;
            this.elContainer.current.style.height = `${window.innerHeight - this.theme.spacing * 5}px`;
            this.elContainer.current.classList.add("maximized");
            this.moveAndResize.ignoreMove = true;
            this.moveAndResize.ignoreResize = true;
            return this;
        }

        /**
         * Maximiza a janela
         * @returns {Dialog} Auto referência.
         */
        public restore(): Dialog {
            if (!this.moveAndResize || !this.elContainer.current || !this.lastDialogState) return this;
            this.elContainer.current.style.left = `${this.lastDialogState.position.x}px`;
            this.elContainer.current.style.top = `${this.lastDialogState.position.y}px`;
            this.elContainer.current.style.width = `${this.lastDialogState.size.width}px`;
            this.elContainer.current.style.height = `${this.lastDialogState.size.height}px`;
            this.elContainer.current.classList.remove("maximized");
            this.moveAndResize.ignoreMove = false;
            this.moveAndResize.ignoreResize = false;
            return this;
        }

        /**
         * Define a exibição da janela.
         * Quando nenhum parâmetro é informado apenas retorna a informação.
         * @param {boolean} mode Opcional. Exibe ou esconde.
         * @returns {boolean} Retorna o estado de exibição da janela.
         */
        public visible(mode?: boolean): boolean {
            const visibility = this.visibility as Visibility;
            const result = visibility.visible(mode);
            if (mode !== undefined) {
                if (result) setTimeout(() => this.bring(Util.BringTo.Front), visibility.fade());
                else setTimeout(() => this.bring(Util.BringTo.Back), visibility.fade());
            }
            return result;
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
         * Evento ao redimensionar.
         */
        private onResize(): void {
            if (this.props.onResize instanceof Function) this.props.onResize();
        }

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
         * Determina se a janela está ativa em primeiro plano.
         * @returns {boolean} true para ativa.
         */
        public active(): boolean {
            return Util.DOM.isBring((this.elContainer.current as HTMLElement).parentElement as HTMLElement, Util.BringTo.Front);
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
                        <div>
                            <span className="graph"><i className={this.props.icon ? this.props.icon : "fas fa-cog"}></i></span>
                            <a href="#" className="close dialog-action" onClick={this.close} title={this.translate("Close this window.")}><i className="fas fa-times"></i></a>
                            <a href="#" className="maximize dialog-action" onClick={this.maximize} title={this.translate("Maximize this window.")}><i className="fas fa-expand"></i></a>
                            <a href="#" className="restore dialog-action" onClick={this.restore} title={this.translate("Restore size of this window.")}><i className="fas fa-compress"></i></a>
                            <h1 ref={this.elTitle}>{this.props.title}</h1>
                        </div>
                    </div>
                    <div className="content">
                        {(this.state.children as React.ReactNode[]).map(child => !child ? "" : <div key={Util.Text.random()}>{child}</div>)}
                    </div>  
                    <div className="resize"><div ref={this.elResize}>&nbsp;</div></div>
                </div>
            );
        }

        /**
         * Quando o componente é montado.
         */
        public componentDidMount(): void {
            this.moveAndResize = new MoveAndResize({ 
                owner: this,
                elContainer: this.elContainer.current as HTMLElement,
                elMove: [this.elTitle.current as HTMLElement],
                elResize: [this.elResize.current as HTMLElement],
                ignoreEventClick: this.ignoreEventClick,
                onResize: this.onResize
            });

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

    }
}

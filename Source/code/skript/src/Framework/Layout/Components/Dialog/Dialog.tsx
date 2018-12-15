namespace Skript.Framework.Layout.Components.Dialog {
    
    /**
     * Janela base que contem outros componentes.
     */
    export class Dialog extends Base<Props, State> {

        /**
         * Cria uma instância desse componente.
         * @param {Props} props Opcional. Propriedades.
         * @param {any} children Opcional. Propriedades.
         * @returns {Dialog} Instância.
         */
        public static create(props?: Props, children?: any): Dialog {            
            return ReactDOM.render(
                React.createElement(Dialog, props ? props : new Props(), children),
                Core.Main.instance.presentation.createContainer());
        }

        /**
         * Dimensão padrão da janela.
         * @type {TypeError.Size}
         */
        private static defaults: Types.Size = { 
            width: 500,
            height: 250
        };

        /**
         * Carrega e aplica os estilos css.
         */
        public css: string = `
            ${this.classNameSelector()} {
                z-index: 996;
                box-shadow: 0 0 20px black;
                border-radius: 7px;
                overflow: hidden;
                position: fixed;
                left: calc(50% - ${Dialog.defaults.width / 2}px);
                top: calc(50% - ${Dialog.defaults.height / 2}px);
                min-width: 200px;
                min-height: 100px;
                width: ${Dialog.defaults.width}px;
                height: ${Dialog.defaults.height}px;
            }
            ${this.classNameSelector()} > .dialog-header {
                background-color: rgba(200,200,200,0.9);
                border-bottom: 1px solid rgba(0,0,0,0.25);
                border-radius: 7px 7px 0 0;                
                cursor: pointer;
                position: relative;
                text-shadow: 0 0 5px rgba(0,0,0,0.25);
            }
            ${this.classNameSelector()} > .dialog-header > div {
                padding: 9px 0 8px 0;
            }
            .${Core.Main.instance.presentation.configuration.className} > *:last-child > .${this.className} > .dialog-header > div {
                background-image: linear-gradient(rgba(255,255,255,0.75), transparent);
            }
            ${this.classNameSelector()} > .dialog-header h1 {
                white-space: nowrap;
                margin: 1px ${this.spacing}px -1px ${this.spacing}px;                
                padding: 0;
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                width: calc(100% - 110px);
                text-align: left;
                clear: unset;
            }
            ${this.classNameSelector()} > .dialog-header .graph {
                font-size: 20px;
                float: left;
                margin: 0 9px 0 11px;
                opacity: 1;
            }
            ${this.classNameSelector()} > .dialog-header button {
                margin: 0;
                padding: 0;
                background: none;
                border: none;
                cursor: pointer;
            }
            ${this.classNameSelector()} > .dialog-header button.dialog-action {
                font-size: 13px;
                border-bottom: none;
                text-transform: none;
                display: inline-block;
                margin: 5px 15px 0 3px;
                float: right;
                opacity: 0.5;
            }
            ${this.classNameSelector()} > .dialog-header button.dialog-action:hover {
                text-shadow: 0 0 5px rgba(0,0,0,0.25);
                opacity: 0.75;
            }
            ${this.classNameSelector()}.maximized > .dialog-header button.maximize {
                display: none;
            }
            ${this.classNameSelector()}:not(.maximized) > .dialog-header button.restore {
                display: none;
            }
            ${this.classNameSelector()} > .dialog-content {
                background: rgba(255,255,255,0.95);
                width: 100%;
                height: calc(100% - 50px);
                overflow: auto;
                overflow-x: hidden;
                position: relative;
                text-align: left;
            }
            ${this.classNameSelector()} > .dialog-resize {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 100%;
                overflow: hidden;
                background-color: rgba(200,200,200,0.9);
                border-top: 1px solid rgba(0,0,0,0.25);
            }
            ${this.classNameSelector()} > .dialog-resize div {
                background-color: transparent;
                float: right;
                width: 20px;
                height: 10px;
            }
            ${this.classNameSelector()}:not(.maximized) > .dialog-resize div {
                cursor: nw-resize;
            }            
            ${this.classNameSelector()} > .header,
            ${this.classNameSelector()} > .resize {
                opacity: 0.9;
            }
        `;

        /**
         * Construtor.
         * @param {Props} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);

            this.state = { children: this.props.children ? [this.props.children] : [] };

            this.elContainer = React.createRef();
            this.elTitle = React.createRef();
            this.elResize = React.createRef();

            this.onResize = this.onResize.bind(this);
            this.close = this.close.bind(this);
            this.maximize = this.maximize.bind(this);
            this.restore = this.restore.bind(this);

            this.toCaptureOff.push(Bus.Message.capture("keyup", this, this.shortcut));
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
        public onClose: ((mode: CloseMode) => void)[] = [];

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
            
            this.visible(false);
            if (this.props.closeMode === CloseMode.Remove) {
                setTimeout(() => {
                    ReactDOM.unmountComponentAtNode(container);
                    container.remove();
                }, (this.visibility as Visibility).fade() * 1000 + 500);
            }
            
            return this;
        }

        /**
         * Informações sobre o posicionamento e dimensão da janela antes de maximizar.
         * @type {Types.SizeAndPosition}
         */
        private lastDialogState?: Types.SizeAndPosition;

        /**
         * Maximiza a janela
         * @returns {Dialog} Auto referência.
         */
        public maximize(): Dialog {
            if (!this.elContainer.current) return this;

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

            this.elContainer.current.style.left = `${this.spacing * 2}px`;
            this.elContainer.current.style.top = `${this.spacing * 2}px`;
            this.elContainer.current.style.width = `${window.innerWidth - this.spacing * 5}px`;
            this.elContainer.current.style.height = `${window.innerHeight - this.spacing * 5}px`;
            this.elContainer.current.classList.add("maximized");

            if (this.moveAndResize) {
                this.moveAndResize.ignoreMove = true;
                this.moveAndResize.ignoreResize = true;
            }

            setTimeout(() => { if (this.onResize instanceof Function) this.onResize(); }, 1);

            return this;
        }

        /**
         * Maximiza a janela
         * @returns {Dialog} Auto referência.
         */
        public restore(): Dialog {
            if (!this.elContainer.current || !this.lastDialogState) return this;

            this.elContainer.current.style.left = `${this.lastDialogState.position.x}px`;
            this.elContainer.current.style.top = `${this.lastDialogState.position.y}px`;
            this.elContainer.current.style.width = `${this.lastDialogState.size.width}px`;
            this.elContainer.current.style.height = `${this.lastDialogState.size.height}px`;

            this.elContainer.current.classList.remove("maximized");
            if (this.moveAndResize) {
                this.moveAndResize.ignoreMove = false;
                this.moveAndResize.ignoreResize = false;
            }
            
            setTimeout(() => { if (this.onResize instanceof Function) this.onResize(); }, 1);

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
                if (result) setTimeout(() => this.bring(Types.BackFront.Front), visibility.fade() * 1000);
                else setTimeout(() => this.bring(Types.BackFront.Back), visibility.fade() * 1000);
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
                console.Log("Added to DialogContainer \"{title}\": {count} itens.", { title: this.props.title, count: this.appendDelay.length }, "Layout.Components.Dialog");
                this.setState({ children: (this.state.children as React.ReactNode[]).concat(this.appendDelay) });
                this.appendDelay.length = 0;
            }, delay) as any;
        }

        /**
         * Move a janela de diálogo pra frente ou pra trás das outras.
         * @param {BringTo} to Optional. Direção. 
         * @returns {Dialog} Auto referência.
         */
        public bring(to: Types.BackFront = Types.BackFront.Front): Dialog {
            Util.DOM.bring((this.elContainer.current as HTMLElement).parentElement as HTMLElement, to);
            return this;
        }

        /**
         * Determina se a janela está ativa em primeiro plano.
         * @returns {boolean} true para ativa.
         */
        public active(): boolean {
            return Util.DOM.isBring((this.elContainer.current as HTMLElement).parentElement as HTMLElement, Types.BackFront.Front);
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
                Util.DOM.isBring(this.elContainer.current.parentElement, Types.BackFront.Front)) {
                    this.close();
                    return true;
            }
            return false;                
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute()} ref={this.elContainer}>
                    <div className="dialog-header">
                        <div>
                            <span className="graph"><i className={this.props.icon ? this.props.icon : "fas fa-cog"}></i></span>
                            <button className="close dialog-action" onClick={this.close} title={"Close this window.".translate()}><i className="fas fa-times"></i></button>
                            <button className="maximize dialog-action" onClick={this.maximize} title={"Maximize this window.".translate()}><i className="fas fa-expand"></i></button>
                            <button className="restore dialog-action" onClick={this.restore} title={"Restore size of this window.".translate()}><i className="fas fa-compress"></i></button>
                            <h1 ref={this.elTitle}>{this.props.title}</h1>
                        </div>
                    </div>
                    <div className="dialog-content">
                        {(this.state.children as React.ReactNode[]).map((child, i) => child ? <div key={i}>{child}</div> : undefined)}
                    </div>  
                    <div className="dialog-resize"><div ref={this.elResize}>&nbsp;</div></div>
                </div>
            );
        }

        /**
         * Quando o componente é montado.
         */
        public componentDidMount(): void { super.componentDidMount();
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

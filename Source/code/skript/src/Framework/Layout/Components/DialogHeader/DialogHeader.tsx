namespace Skript.Framework.Layout.Components.DialogHeader {

    /**
     * Ids de elementos
     */
    enum IdContext {

        /**
         * Onde ficará o conteúdo na janela.
         */
        Dialog,

        /**
         * Onde ficará o conteúdo no componente.
         */
        Original,

        /**
         * Conteúdo
         */
        Content
    }

    /**
     * Cabeçalho de título.
     */
    export class DialogHeader extends Base<Props> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css: string = `
            ${this.classNameSelector()} {
                margin: 0px ${this.spacing * 2}px ${this.spacing}px ${this.spacing * 2}px;
            }
            ${this.classNameSelector()} > .dialogheader-title {
                background-color: rgba(200,200,200,0.9);
                border-radius: 4px;
                padding: 5px 10px;
                margin: 0 -${this.spacing}px;
                box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(0,0,0,0.25);
                cursor: pointer;
            }
            ${this.classNameSelector()} > .dialogheader-title .text .graph {
                float: left;
                margin: 0 8px 0 2px;
            }
            ${this.classNameSelector()} > .dialogheader-title .text h1 {
                font-family: 'Raleway', sans-serif;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 2px 0;
                padding: 0;
                width: calc(100% - 60px);
                font-size: 16px;
                clear: unset;
            }
            ${this.classNameSelector()} > .dialogheader-title .showDialog {
                float: right;
                opacity: 0.75;
                margin: 4px 3px 0 0;
            }
            ${this.classNameSelector()} > .dialogheader-title .showDialog:hover {
                text-shadow: 0 0 5px rgba(0,0,0,0.25);
                opacity: 1.0;
            }
            ${this.classNameSelector()} > .dialogheader-content {
                margin-top: ${this.spacing}px;
                transition: max-height 0.25s linear;
                overflow: hidden;
            }
            ${this.classNameSelector()} > .dialogheader-content.hidden {
                max-height: 0 !important;
            }
        </div>
        `;

        /**
         * Intervalo das animações.
         * @type {number}
         */
        private intervalAnimation: number = 300;

        /**
         * Construtor.
         * @param {Props} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);

            this.elContent = React.createRef();

            this.onResize = this.onResize.bind(this);

            this.onHeaderClick = this.onHeaderClick.bind(this);
            this.onDialogClick = this.onDialogClick.bind(this);
        }

        /**
         * Aplicado quando não tem janela. Class CSS para tornar o conteúdo com o mesmo estilo dentro e fora da janela.
         * @type {string}
         */
        public classNameOutDialog: string = this.className + "-" + IdContext[IdContext.Original].random();

        /**
         * Aplicado quando está na janela. Class CSS para tornar o conteúdo com o mesmo estilo dentro e fora da janela.
         * @type {string}
         */
        public classNameInDialog: string = this.className + "-" + IdContext[IdContext.Dialog].random();

        /**
         * Conteúdo.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContent: React.RefObject<HTMLDivElement>;

        /**
         * Quando o botão é pressionado.
         */
        private onHeaderClick() {
            if (this.dialog()) {
                this.dialog(false);
                this.content(true);
            }
            else this.content(!this.content());
        }

        /**
         * Quando o botão é pressionado.
         */
        private onDialogClick() {
            this.dialog(true);
        }

        /**
         * Retorna um id para cada contexto.
         * @param {string} context Contexto
         * @returns {string} string para uso em atributo id.
         */
        private contextId(context: IdContext): string {
            return this.id + "-" + IdContext[context].random();
        }

        /**
         * Retorna o elemento com base no contexto.
         * @param {string} context Contexto
         * @returns {HTMLElement} Elemento.
         */
        private contextElement(context: IdContext): HTMLElement {
            return document.getElementById(this.contextId(context)) as HTMLElement;
        }

        /**
         * Instância da janela de diálogo.
         * @type {Dialog.Dialog|undefined}
         */
        private instanceDialog: Dialog.Dialog|undefined;

        /**
         * Últimas posições de janela utilizadas.
         */
        private static lastPosition: Types.Position = {
            x: 0,
            y: 0
        };

        /**
         * Evento ao redimensionar.
         */
        private onResize(): void {
            if (this.props.onResize instanceof Function) this.props.onResize();
        }

        /**
         * Cria a janela de diálogo.
         * @returns {Dialog.Dialog} Janela criada.
         */
        private getOrCreateDialog(): Dialog.Dialog {
            if (!this.instanceDialog) {

                const positionIncrement = 50;
                const position: Types.Position = this.props.dialogPosition ? this.props.dialogPosition : (DialogHeader.lastPosition = {
                    x: DialogHeader.lastPosition.x + positionIncrement,
                    y: DialogHeader.lastPosition.x + positionIncrement
                });
                if (DialogHeader.lastPosition.y > window.innerHeight * 0.6) {
                    DialogHeader.lastPosition.x = DialogHeader.lastPosition.y = positionIncrement;
                }

                this.instanceDialog = Dialog.Dialog.create({
                    title: this.props.title ? this.props.title : "",
                    closeMode: Dialog.CloseMode.Hide,
                    icon: this.props.icon,
                    className: "moduleDialog",
                    size: this.props.dialogSize,
                    position: position,
                    onResize: this.onResize}, 
                    <div 
                        id={this.contextId(IdContext.Dialog)} 
                        className={this.classNameInDialog}
                        style={{ margin: `${this.spacing}px` }}>
                    </div>);

                this.instanceDialog.onClose.push(() => {
                    this.moveContentToDialog(false);
                    this.content(false);
                });
            }
            return this.instanceDialog;
        }

        /**
         * Move o conteúdo para a janela (ou tira de lá para o componente).
         * @param mode Modo.
         */
        private moveContentToDialog(mode: boolean): void {
            const moveFrom = !mode ? IdContext.Dialog : IdContext.Original;
            const moveTo = mode ? IdContext.Dialog : IdContext.Original;

            this.contextElement(moveTo).appendChild(this.contextElement(IdContext.Content));
            setTimeout(() => { if (this.onResize instanceof Function) this.onResize(); }, 1);

            console.Log("DialogHeader \"{title}\". Content moved from [{from}] to [{to}].", { title: this.props.title, from: IdContext[moveFrom], to: IdContext[moveTo] }, "Layout.Components");
        }

        /**
         * Abre ou fechada a janela.
         * @param {boolean} mode Opcional. Modo.
         * @returns {boolean} Estado atual.
         */
        public dialog(mode?: boolean): boolean {
            let state = !!this.instanceDialog && this.instanceDialog.visible();
            if (mode !== undefined) {
                if (!mode && state) {
                    this.getOrCreateDialog().close();
                    this.moveContentToDialog(false);
                    this.content(false);
                } else if (mode) {
                    const dialog = this.getOrCreateDialog();
                    if (!state) {
                        setTimeout(() => {
                            this.moveContentToDialog(true);
                            setTimeout(() => dialog.open().bring(), 1); //setTimeout para fazer a transição CSS.
                        }, this.content() ? this.intervalAnimation : 0);
                        this.content(false);
                    } else {
                        dialog.bring();
                    }
                }
                state = mode;
            }
            return state;
        }

        /**
         * Abre ou fecha o conteúdo.
         * @param {boolean} mode Opcional. Modo.
         * @returns {boolean} Estado atual.
         */
        public content(mode?: boolean): boolean {
            const container = this.elContent.current as HTMLElement;

            let state = !container.classList.contains("hidden");

            if (mode !== undefined) {
                if (!mode && state) {
                    container.style.maxHeight = container.offsetHeight + "px";
                    setTimeout(() => container.classList.add("hidden"), 1);
                } else if (mode && !state) {
                    if (!container.style.maxHeight) container.style.maxHeight = "500px"; //Apenas para garantir a animação.
                    container.classList.remove("hidden");
                    setTimeout(() => container.style.maxHeight = "", this.intervalAnimation);
                }
                state = mode;
            }

            return state;
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    <div className="dialogheader-title" style={ { display: this.props.title ? "inherit" : "none" } }>
                        <span
                            title={"Open as window.".translate()}
                            className="anchor showDialog no-underline dialog-action"
                            style={ { display: this.props.dialog ? "inherit" : "none" } }
                            onClick={this.props.dialog ? this.onDialogClick : undefined}>
                            <i className="far fa-window-restore"></i>
                        </span>
                        <span className={(this.props.collapsible ? "anchor " : "") + "text no-underline dialog-action"} onClick={this.props.collapsible ? this.onHeaderClick : undefined}>
                            <span className="graph"><i className={this.props.icon ? this.props.icon : "fas fa-cog"}></i></span>
                            <h1>{this.props.title}</h1>
                        </span>
                    </div>
                    <div className={this.classNameOutDialog + " dialogheader-content" + (this.props.title ? " hidden" : "")} id={this.contextId(IdContext.Original)} ref={this.elContent}>
                        <div id={this.contextId(IdContext.Content)}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

namespace Skript.Layout.ReactJs.Component {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

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
        Component,

        /**
         * Conteúdo
         */
        Content
    }

    /**
     * Conjunto de dados props para este compoenente.
     */
    class HeaderContainerProps extends Layout.ReactJs.EmptyProps {

        /**
         * Título.
         * @type {string}
         */
        title?: string;

        /**
         * Ícone. Opcional.
         * @type {string}
         */
        icon?: string;

        /**
         * Indica se deve haver opção de colapsar.
         * @type {boolean}
         */
        collapsible?: boolean;

        /**
         * Indica se deve haver opção de janela de diálogo
         * @type {boolean}
         */
        dialog?: boolean;

        /**
         * Dimensão padrão da janela se estiver habilitada.
         * @type {Core.Size|undefined}
         */
        dialogSize?: Core.Size;

        /**
         * Posição padrão da janela se estiver habilitada.
         * @type {Core.Position|undefined}
         */
        dialogPosition?: Core.Position;
    }

    /**
     * Cabeçalho de título.
     */
    export class HeaderContainer extends ComponentBase<HeaderContainerProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                margin: 0px 20px 10px 20px;
            }
            ${this.selector()} > .title {
                background-color: ${this.theme.dialogTitleBackgroundColor};
                color: ${this.theme.dialogTitleTextColor};
                border-radius: 4px;
                padding: 5px 10px;
                margin: 0 -10px;
                box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
                border: 1px solid ${Util.Drawing.blend(-0.1, this.theme.dialogTitleBackgroundColor)};
            }
            ${this.selector()} > .title .text .graph {
                float: left;
                margin-right: 8px;
            }
            ${this.selector()} > .title .text h1 {
                font-family: 'Raleway', sans-serif;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 2px 0;
                width: calc(100% - 60px);
            }
            ${this.selector()} > .title .showDialog {
                float: right;
            }
            ${this.selector()} > .content {
                margin-top: 10px;
                transition: max-height 0.25s linear;
                overflow: hidden;                
            }
            ${this.selector()} > .content.hide {
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
         * @param {HeaderContainerProps} props Propriedades.
         */
        public constructor(props: HeaderContainerProps) {
            super(props);

            this.elContent = React.createRef();

            this.onHeaderClick = this.onHeaderClick.bind(this);
            this.onDialogClick = this.onDialogClick.bind(this);            
        }

        /**
         * Marca para Class CSS para tornar o conteúdo com o mesmo estilo dentro e fora da janela.
         * @type {string}
         */
        private static classNameMark: string = Util.String.random()

        /**
         * Aplicado quando não tem janela. Class CSS para tornar o conteúdo com o mesmo estilo dentro e fora da janela.
         * @type {string}
         */
        public static classNameOutDialog: () => string = () => HeaderContainer.classNameMark + "-" + IdContext[IdContext.Component];

        /**
         * Aplicado quando está na janela. Class CSS para tornar o conteúdo com o mesmo estilo dentro e fora da janela.
         * @type {string}
         */
        public static classNameInDialog: () => string = () => HeaderContainer.classNameMark + "-" + IdContext[IdContext.Dialog];

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
            this.dialog(!this.dialog());
        }

        /**
         * Retorna um id para cada contexto.
         * @param {string} context Contexto
         * @returns {string} string para uso em atributo id.
         */
        private contextId(context: IdContext): string {
            return this.id() + "-" + IdContext[context];
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
         * @type {Component.Dialog|undefined}
         */
        private instanceDialog: Component.Dialog|undefined;

        /**
         * Últimas posições de janela utilizadas.
         */
        private static lastPosition: Core.Position = {
            x: 0,
            y: 0
        };

        /**
         * Cria a janela de diálogo.
         * @returns {Component.Dialog} Janela criada.
         */
        private getOrCreateDialog(): Component.Dialog {
            if (!this.instanceDialog) {                
                
                const positionIncrement = 50;
                const position: Core.Position = this.props.dialogPosition ? this.props.dialogPosition : (HeaderContainer.lastPosition = {
                    x: HeaderContainer.lastPosition.x + positionIncrement,
                    y: HeaderContainer.lastPosition.x + positionIncrement
                });
                if (HeaderContainer.lastPosition.y > window.innerHeight * 0.6) {
                    HeaderContainer.lastPosition.x = HeaderContainer.lastPosition.y = positionIncrement;
                }

                const messageBus = new Message.DialogCreate(
                    this.props.title ? this.props.title : "",
                    DialogCloseMode.Hide,
                    this.props.icon,
                    <div id={this.contextId(IdContext.Dialog)} className={HeaderContainer.classNameInDialog()} style={{ margin: "10px" }}></div>,
                    this.props.dialogSize,
                    position).sendSync() as Message.DialogCreate;
                if (!messageBus.result) throw new Core.Errors.NullNotExpected("Message.DialogCreate.result");
                this.instanceDialog = messageBus.result.dialog;
                
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
            const moveFrom = !mode ? IdContext.Dialog : IdContext.Component;
            const moveTo = mode ? IdContext.Dialog : IdContext.Component;

            this.contextElement(moveTo).appendChild(this.contextElement(IdContext.Content));

            skript.log.post("HeaderContainer \"{title}\". Content moved from [{from}] to [{to}].", { title: this.props.title, from: IdContext[moveFrom], to: IdContext[moveTo] }, Core.Log.Level.DebugDOM);
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
                } else if (mode && !state) {                    
                    setTimeout(() => {
                        const dialog = this.getOrCreateDialog();
                        this.moveContentToDialog(true);
                        setTimeout(() => dialog.open().bring(), 1); //setTimeout para fazer a transição CSS.
                    }, this.content() ? this.intervalAnimation : 0);
                    this.content(false);
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

            let state = !container.classList.contains("hide");

            if (mode !== undefined) {
                if (!mode && state) {
                    container.style.maxHeight = container.offsetHeight + "px";
                    setTimeout(() => container.classList.add("hide"), 1);
                } else if (mode && !state) {
                    if (!container.style.maxHeight) container.style.maxHeight = "100px"; //Apenas para garantir a animação.
                    container.classList.remove("hide");
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
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    <div className="title" style={ { display: this.props.title ? "inherit" : "none" } }>
                        <span 
                            title={this.translate("Toggle the view as a window.")}
                            className="anchor showDialog no-underline action" 
                            style={ { display: this.props.dialog ? "inherit" : "none" } } 
                            onClick={this.props.dialog ? this.onDialogClick : undefined}>
                            <i className="far fa-window-restore"></i>
                        </span>
                        <span className={(this.props.collapsible ? "anchor " : "") + "text no-underline action"} onClick={this.props.collapsible ? this.onHeaderClick : undefined}>
                            <span className="graph"><i className={this.props.icon ? this.props.icon : "fas fa-cog"}></i></span>
                            <h1>{this.props.title}</h1>
                        </span>
                    </div>
                    <div className={HeaderContainer.classNameOutDialog() + " content hide"} id={this.contextId(IdContext.Component)} ref={this.elContent}>
                        <div id={this.contextId(IdContext.Content)}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

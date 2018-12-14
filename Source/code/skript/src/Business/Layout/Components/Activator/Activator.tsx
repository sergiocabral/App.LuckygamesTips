namespace Skript.Business.Layout.Components.Activator {

    /**
     * Botão que ativa o sistema.
     */
    export class Activator extends Base {

        /**
         * Cria uma instância desse componente.
         * @param {Props} props Opcional. Propriedades.
         * @param {any} children Opcional. Propriedades.
         * @returns {Activator} Instância.
         */
        public static create(): Activator {
            return ReactDOM.render(
                React.createElement(Activator, undefined, null),
                Core.Main.instance.presentation.createContainer());
        }

        /**
         * Carrega e aplica os estilos css.
         */
        public css: string = `
            ${this.classNameSelector()} {
                z-index: 99999;
                background-color: transparent;
                background-image: url("${this.theme.url}/logo.png");
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                border: none;
                cursor: pointer;
                position: fixed;
                width: 50px;
                height: 50px;
                right: ${this.theme.spacing}px;
                bottom: ${this.theme.spacing}px;
            }
            ${this.classNameSelector()}:focus {
                outline: none;
            }
            ${this.classNameSelector()} i:before {
                display: none;
            }
        `;

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);

            this.elButton = React.createRef();

            this.onClick = this.onClick.bind(this);

            this.mainDialog = undefined as any;
            setTimeout(() => {
                this.mainDialog = Framework.Layout.Components.Dialog.Dialog.create({
                    title: Core.Main.instance.configuration.name,
                    closeMode: Framework.Layout.Components.Dialog.CloseMode.Hide
                });
                new Messages.DidMainDialogLoaded().send();
            }, 0);

            this.toCaptureOff.push(Framework.Bus.Message.capture(Messages.DoAppendToMainDialog, this, this.onDoAppendToMainDialog));
        }

        /**
         * Evento ao solicitar adicionar na janela principal.
         * @param evt Informações sobre o evento.
         */
        private onDoAppendToMainDialog(evt: CustomEvent<Messages.DoAppendToMainDialog>) {
            this.mainDialog.append(evt.detail.part);
        }

        /**
         * Instância da janela principal do sistema.
         * @type {Framework.Layout.Components.Dialog.Dialog}
         */
        public mainDialog: Framework.Layout.Components.Dialog.Dialog;

        /**
         * Manipulador de arrastar e redimensionar.
         * @type {Framework.Layout.Components.MoveAndResize}
         */
        public moveAndResize?: Framework.Layout.Components.MoveAndResize;

        /**
         * Referência ao botão.
         * @type {React.RefObject<HTMLButtonElement>}
         */
        private elButton: React.RefObject<HTMLButtonElement>;

        /**
         * Implementa a exibição/esconder suave do elemento.
         * @type {Framework.Layout.Components.Visibility}
         */
        private visibility?: Framework.Layout.Components.Visibility;

        /**
         * Quando o botão é acionado.
         */
        private onClick(): void {
            if (this.moveAndResize && !this.moveAndResize.control.clicked) return;
            this.mainDialog.visible(!this.mainDialog.visible());
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <button id={this.id} className={this.classNameAttribute()} ref={this.elButton} onClick={this.onClick}>
                    <i className="fas fa-robot"></i>
                </button>
            );
        }

        /**
         * Quando o componente é montado.
         */
        public componentDidMount(): void { super.componentDidMount();
            this.moveAndResize = new Framework.Layout.Components.MoveAndResize({
                owner: this,
                elContainer: this.elButton.current as HTMLElement,
                elMove: [this.elButton.current as HTMLElement],
                elResize: [],
                ignoreBringToFront: () => true
            });

            this.visibility = new Framework.Layout.Components.Visibility({
                element: this.elButton.current as HTMLElement,
                show: true,
                fade: 2,
                opacityVisible: 0.8
            });
            setTimeout(() => (this.visibility as Framework.Layout.Components.Visibility).fade(0.2), 2000);
        }
    }
}

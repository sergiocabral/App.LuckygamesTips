namespace Skript.Layout.ReactJs.Component {

    /**
     * Botão que ativa o sistema.
     */
    export class ButtonActivator extends ComponentBase<EmptyProps, Partial<EmptyState>> {

        /**
         * Nome da classe CSS deste componente.
         */
        public className: string = 'activator';

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} {
                z-index: ${skript.stylesheet.zIndex * 2};
                background-color: transparent;
                background-image: url("${this.theme.url}/media/logo.png");
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                border: none;
                cursor: pointer;                
                position: fixed;
                width: 75px;
                height: 75px;
                right: 10px;
                bottom: 10px;
            }
            ${this.selector()}:focus {
                outline: none;
            }
            ${this.selector()} i:before {
                display: none;
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: EmptyProps) {
            super(props);            
            this.elButton = React.createRef();
            this.onClick = this.onClick.bind(this);
        }

        /**
         * Manipulador de arrastar e redimensionar.
         */
        public moveAndResize?: MoveAndResize;

        /**
         * Referência ao botão.
         * @type {React.RefObject<HTMLElement>}
         */
        private elButton: React.RefObject<HTMLElement>;

        /**
         * Implementa a exibição/esconder suave do elemento.
         * @type {Visibility}
         */
        private visibility?: Visibility;

        /**
         * Quando o botão é acionado.
         */
        private onClick(): void {
            if (this.moveAndResize && !this.moveAndResize.control.clicked) return;
            Core.Bus.MessageBus.send(new Layout.Message.MainDialogToggle());
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <button id={this.id()} className={this.className + " no-shadow"} ref={this.elButton as any} onClick={this.onClick}>
                    <i className="fas fa-robot"></i>
                </button>
            );
        }

        /**
         * Quando o componente é montado.
         */
        public componentDidMount(): void {
            this.moveAndResize = new MoveAndResize({ 
                owner: this,
                elContainer: this.elButton.current as HTMLElement,
                elMove: [this.elButton.current as HTMLElement],
                elResize: [],
                ignoreBringToFront: () => true
            });

            this.visibility = new Visibility({
                element: this.elButton.current as HTMLElement,
                show: true,
                fade: 2,
                opacityVisible: 0.8
            });
            setTimeout(() => (this.visibility as Visibility).fade(0.2), 2000);
        }
    }
}

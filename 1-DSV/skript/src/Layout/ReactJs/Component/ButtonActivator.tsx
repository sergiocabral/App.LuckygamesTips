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
                background-image: url("https://dsv.luckygames.tips/mysys/Business/Images/button.png");
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                border: none;
                cursor: pointer;                
                opacity: 0.8;
                position: fixed;
                transition: opacity 0.2s ease-out;
                width: 75px;
                height: 75px;
                right: 10px;
                bottom: 10px;
                display: block !important;
            }
            ${this.selector()}.smooth {
                transition: opacity 2s ease-out;
            }
            ${this.selector()}.hide {
                opacity: 0;
            }
            ${this.selector()}:hover {
                opacity: 1;
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
         * Quando o botão é acionado.
         */
        private onClick(): void {
            if (this.moveAndResize && !this.moveAndResize.control.clicked) return;
            Core.Bus.MessageDispatcher.Send(new Layout.Message.MainDialogToggle());
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <button id={Util.String.random()} className={this.className + " smooth hide"} style={{ display: "none" }} ref={this.elButton as any} onClick={this.onClick}>
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

            setTimeout(() => (this.elButton.current as HTMLElement).classList.remove("hide"), 1000);
            setTimeout(() => (this.elButton.current as HTMLElement).classList.remove("smooth"), 3000);
        }
    }
}

namespace Layout.ReactJs.Component {

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
                z-index: ${tips.stylesheet.zIndex * 2};
                background-color: transparent;
                background-image: url("https://dsv.luckygames.tips/mysys/Business/Images/button.png");
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                border: none;
                cursor: pointer;
                height: 75px;
                left: 5px;
                opacity: 0.75;
                position: fixed;
                top: 5px;
                transition: opacity 1s ease-in-out;
                width: 75px;
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
            ${this.selector()} span {
                display: inline-block;
                background-color: azure;
                position: relative;
                top: 50px;
                float: right;
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: EmptyProps) {
            super(props);
            
            this.elButton = React.createRef();
            this.elResize = React.createRef();
        }

        /**
         * Referência ao botão.
         * @type {React.RefObject<HTMLElement>}
         */
        private elButton: React.RefObject<HTMLElement>;
        private elResize: React.RefObject<HTMLElement>;

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <button id={Util.String.random()} className={this.className} ref={this.elButton as any}>
                    <i className="fas fa-robot"></i>
                    <span ref={this.elResize}>Resize</span>
                </button>
            );
        }

        /**
         * Lógica para arrasta e redimensiona elementos.
         */
        private moveAndResize: MoveAndResize|undefined = undefined;

        /**
         * Quando o componente é montado.
         */
        public componentDidMount(): void {
            if (this.moveAndResize !== undefined) throw new Error("TODO: Quero saber se este código roda duas vezes. Não pode. Aplicar verificador se esse erro disparar");

            this.moveAndResize = new MoveAndResize({ 
                elContainer: this.elButton.current as HTMLElement,
                elMove: [this.elButton.current as HTMLElement],
                elResize: [this.elResize.current as HTMLElement]
            });
        }
    }
}

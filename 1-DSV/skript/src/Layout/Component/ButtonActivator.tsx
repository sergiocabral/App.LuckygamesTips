namespace Layout.Component {

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
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: EmptyProps) {
            super(props);
            
            this.elButton = React.createRef();

            this.onMouseDown = this.onMouseDown.bind(this);
        }

        /**
         * Referência ao botão.
         * @type {React.RefObject<HTMLElement>}
         */
        private elButton: React.RefObject<HTMLElement>;

        /**
         * Coleção de informações sobre a movimentação da janela de diálogo.
         * @type {any}
         */
        private controlMoviment: any = {
            _this: this,
            isDown: false,
            wasMoving: false,
            offset: [0, 0],
            mousePosition: { x: 0, y: 0 },
            isResize: false,
            elementToMove: undefined,            
            idFrameAnimation: undefined,            
        };

        /**
         * Handler para clique do mouse para começar a arrastar
         * @param {any} ev 
         */
        private onMouseDown(ev: any): void {
            this.controlMoviment.elementToMove = this.elButton.current as HTMLElement;
            this.controlMoviment.isDown = true;

            this.controlMoviment.isResize = ev.target.parentNode.className.indexOf("resize") >= 0;

            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            this.controlMoviment.offset = [
                this.controlMoviment.elementToMove.offsetLeft - clientX,
                this.controlMoviment.elementToMove.offsetTop - clientY
            ];

            window.cancelAnimationFrame(window.requestAnimationFrame(this.onFrameAnimation)); //Linha sem efeito. Necessária para suprimir warning 'declared but never read'.
            tips.any.componentButtonActivatorControlMoviment = this.controlMoviment;

            window.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('mousemove', this.onMouseMove);
            this.controlMoviment.elementToMove.addEventListener('touchend', this.onMouseUp);
            this.controlMoviment.elementToMove.addEventListener('touchmove', this.onMouseMove);
        }

        /**
         * Handler para quando o mouse é liberado e para de arrastar.
         */
        private onMouseUp(): void {
            if (!tips.any.componentButtonActivatorControlMoviment) return;
            const _this = tips.any.componentButtonActivatorControlMoviment._this;

            window.removeEventListener('mouseup', _this.onMouseUp);
            window.removeEventListener('mousemove', _this.onMouseMove);
            _this.controlMoviment.elementToMove.removeEventListener('touchend', _this.onMouseUp);
            _this.controlMoviment.elementToMove.removeEventListener('touchmove', _this.onMouseMove);

            window.cancelAnimationFrame(_this.idFrameAnimation);
            _this.controlMoviment.isDown = false;
            _this.controlMoviment.wasMoving = false;

            delete tips.any.componentButtonActivatorControlMoviment;
        }

        /**
         * Handler para movimento do mouse pela janela (window).
         * @param {any} ev 
         */
        private onMouseMove(ev: any): void {
            ev.preventDefault();

            if (!tips.any.componentButtonActivatorControlMoviment) return;
            const _this = tips.any.componentButtonActivatorControlMoviment._this;

            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            if (_this.controlMoviment.isDown) {
                _this.controlMoviment.mousePosition = {        
                    x: clientX,
                    y: clientY        
                };

                if (!_this.controlMoviment.wasMoving) {
                    _this.controlMoviment.wasMoving = true;
                    _this.controlMoviment.idFrameAnimation = window.requestAnimationFrame(_this.onFrameAnimation);
                }
            }
        }

        /**
         * Função usada para animar o movimento da janela.
         */
        private onFrameAnimation(): void {
            if (!tips.any.componentButtonActivatorControlMoviment) return;
            const _this = tips.any.componentButtonActivatorControlMoviment._this;

            if (!_this.controlMoviment.isResize) {
                _this.controlMoviment.elementToMove.style.left = 
                    (_this.controlMoviment.mousePosition.x + _this.controlMoviment.offset[0]) + 'px';
                _this.controlMoviment.elementToMove.style.top = 
                    (_this.controlMoviment.mousePosition.y + _this.controlMoviment.offset[1]) + 'px';
            } else {
                const diff = 4;
                _this.controlMoviment.elementToMove.style.width = diff +
                    (_this.controlMoviment.mousePosition.x - _this.controlMoviment.elementToMove.offsetLeft) + 'px';
                _this.controlMoviment.elementToMove.style.height = diff +
                    (_this.controlMoviment.mousePosition.y - _this.controlMoviment.elementToMove.offsetTop) + 'px';
                _this.adjustTitleWidth();
            }

            _this.controlMoviment.idFrameAnimation = window.requestAnimationFrame(_this.onFrameAnimation);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <button id={Util.String.random()} className={this.className} ref={this.elButton as any} onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}>
                    <i className="fas fa-robot"></i>
                </button>
            );
        }
    }
}

namespace Layout.Component {

    /**
     * Tipo para props do React deste componente.
     */
    type Props = {

        /**
         * Título da janela de diálogo.
         */
        title: string
    }

    /**
     * Janela base que contem outros componentes.
     */
    export class Dialog extends ComponentBase<Props, Partial<EmptyState>> {

        /**
         * Nome da classe CSS deste componente.
         */
        public className: string = 'dialog';

        private defaults: { width: number, height: number } = { 
            width: 400,
            height: 200
        };

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} {
                z-index: ${this.theme.zIndex};
                background: ${this.theme.generalBackground};
                box-shadow: 0 0 20px black;
                border-radius: 7px;
                position: fixed;
                left: calc(50% - ${this.defaults.width / 2}px);
                top: calc(50% - ${this.defaults.height / 2}px);
                min-width: 200px;
                min-height: 100px;
                width: ${this.defaults.width}px;
                height: ${this.defaults.height}px;
            }
            ${this.selector()} .header {
                background-color: ${this.theme.dialogTitleBackground};
                border-bottom: 1px solid ${Util.Drawing.blend(0.8, this.theme.dialogTitleTextColor)};
                border-radius: 7px 7px 0 0;
                padding: 9px 0 8px 0;
                cursor: pointer;
                position: relative;
            }
            ${this.selector()} .header h1 {
                color: ${this.theme.dialogTitleTextColor};
                font-family: ${this.theme.dialogTextFont};
                white-space: nowrap;
                margin: 0 10px;                
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 85%;
            }
            ${this.selector()} .header .icon {
                color: ${this.theme.dialogTitleTextColor};
                font-size: 20px;
                float: left;
                margin: -3px 9px 0 11px;
                opacity: 1;
            }
            ${this.selector()} .header a.close {
                color: ${Util.Drawing.blend(0.3, this.theme.dialogTitleTextColor)};
                position: absolute;
                right: 13px;
                top: 12px;
                font-size: 13px;
            }
            ${this.selector()} .header a.close:hover {
                color: ${this.theme.dialogTitleTextColor};
            }
            ${this.selector()} .content * {
                margin: 5px 10px;
            }
            ${this.selector()} .content * {
                font-family: ${this.theme.generalTextFont};
                font-size: 14px;              
            }
            ${this.selector()} .content > * {
                margin-left: 10px;
                margin-right: 10px;
            }
            ${this.selector()} .content > *:first-child {
                margin-top: 5px;
            }  
            ${this.selector()} .content > *:last-child {
                margin-bottom: 5px;
            }
            ${this.selector()} .resize {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 15px;
                overflow: hidden;
                background: ${this.theme.generalBackground};
            }
            ${this.selector()} .resize div {
                width: 20px;
                height: 20px;
                background-color: ${Util.Drawing.blend(0.5, this.theme.generalTextColor)};
                float: right;
                transform: rotate(45deg);
                position: relative;
                top: 10px;
                left: 10px;
                cursor: nw-resize;
                transition: opacity 0.5s linear;
                opacity: 0.5;
            }          
            ${this.selector()} .resize div:hover {
                opacity: 1;
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);

            this.elComponent = React.createRef();
            this.elTitle = React.createRef();
            this.elResize = React.createRef();
            
            this.onComponentMouseDown = this.onComponentMouseDown.bind(this);
            this.onTitleBarMouseDown = this.onTitleBarMouseDown.bind(this);
            this.onCloseClick = this.onCloseClick.bind(this);
        }

        /**
         * Referência ao container pai de todos.
         * @type {React.RefObject<HTMLElement>}
         */
        private elComponent: React.RefObject<HTMLElement>;

        /**
         * Referência para o título na barra.
         * @type {React.RefObject<HTMLElement>}
         */
        private elTitle: React.RefObject<HTMLElement>;

        /**
         * Referência para o botão de resize.
         * @type {React.RefObject<HTMLElement>}
         */
        private elResize: React.RefObject<HTMLElement>;

        /**
         * Ajusta o título para sempre caber ma barra.
         */
        private adjustTitleWidth(): void {
            const elComponent = this.elComponent.current as HTMLElement;
            const elTitle = this.elTitle.current as HTMLElement;
            elTitle.style.width = (elComponent.clientWidth - 80) + "px";
        }

        /**
         * Sobre o container pra frente de todos os componentes.
         */
        private bringToFront(): void {
            const component = this.elComponent.current as HTMLElement;
            const container = component.parentNode as HTMLElement;
            const parent = container.parentNode as HTMLElement;

            if (parent.children[parent.children.length - 1] != container) {
                parent.append(container);
            }
        }

        /**
         * Handler para clique do mouse no componente.
         * @param {any} ev 
         */
        private onComponentMouseDown(ev: any): void {
            if (ev.target.className !== "close" && ev.target.parentNode.className !== "close") {
                this.bringToFront();
            }
        }

        /**
         * Quando o botão de fecha é clicado.
         */
        private onCloseClick(): void {
            const component = this.elComponent.current as HTMLElement;
            const container = component.parentNode as HTMLElement;
            ReactDOM.unmountComponentAtNode(container);
            container.remove();
        }

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
        private onTitleBarMouseDown(ev: any): void {
            this.controlMoviment.elementToMove = this.elComponent.current as HTMLDivElement;
            this.controlMoviment.isDown = true;

            this.controlMoviment.isResize = ev.target.parentNode.className.indexOf("resize") >= 0;

            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            this.controlMoviment.offset = [
                this.controlMoviment.elementToMove.offsetLeft - clientX,
                this.controlMoviment.elementToMove.offsetTop - clientY
            ];

            window.cancelAnimationFrame(window.requestAnimationFrame(this.onTitleBarFrameAnimation)); //Linha sem efeito. Necessária para suprimir warning 'declared but never read'.
            all.any.componentDialogControlMoviment = this.controlMoviment;

            window.addEventListener('mouseup', this.onTitleBarMouseUp);
            window.addEventListener('mousemove', this.onTitleBarMouseMove);
            this.controlMoviment.elementToMove.addEventListener('touchend', this.onTitleBarMouseUp);
            this.controlMoviment.elementToMove.addEventListener('touchmove', this.onTitleBarMouseMove);
        }

        /**
         * Handler para quando o mouse é liberado e para de arrastar.
         */
        private onTitleBarMouseUp(): void {
            if (!all.any.componentDialogControlMoviment) return;
            const _this = all.any.componentDialogControlMoviment._this;

            window.removeEventListener('mouseup', _this.onTitleBarMouseUp);
            window.removeEventListener('mousemove', _this.onTitleBarMouseMove);
            _this.controlMoviment.elementToMove.removeEventListener('touchend', _this.onTitleBarMouseUp);
            _this.controlMoviment.elementToMove.removeEventListener('touchmove', _this.onTitleBarMouseMove);

            window.cancelAnimationFrame(_this.idFrameAnimation);
            _this.controlMoviment.isDown = false;
            _this.controlMoviment.wasMoving = false;

            delete all.any.componentDialogControlMoviment;
        }

        /**
         * Handler para movimento do mouse pela janela (window).
         * @param {any} ev 
         */
        private onTitleBarMouseMove(ev: any): void {
            ev.preventDefault();

            if (!all.any.componentDialogControlMoviment) return;
            const _this = all.any.componentDialogControlMoviment._this;

            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            if (_this.controlMoviment.isDown) {
                _this.controlMoviment.mousePosition = {        
                    x: clientX,
                    y: clientY        
                };

                if (!_this.controlMoviment.wasMoving) {
                    _this.controlMoviment.wasMoving = true;
                    _this.controlMoviment.idFrameAnimation = window.requestAnimationFrame(_this.onTitleBarFrameAnimation);
                }
            }
        }

        /**
         * Função usada para animar o movimento da janela.
         */
        private onTitleBarFrameAnimation(): void {
            if (!all.any.componentDialogControlMoviment) return;
            const _this = all.any.componentDialogControlMoviment._this;

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

            _this.controlMoviment.idFrameAnimation = window.requestAnimationFrame(_this.onTitleBarFrameAnimation);
        }
        
        /**
         * Após renderização do componente.
         */
        public componentDidUpdate(): void {
            this.adjustTitleWidth();
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <div id={Util.String.random()} className={this.className} ref={this.elComponent as any} onMouseDown={this.onComponentMouseDown} onTouchStart={this.onComponentMouseDown}>
                    <div className="header" onMouseDown={this.onTitleBarMouseDown} onTouchStart={this.onTitleBarMouseDown}>
                        <span className="icon"><i className="fas fa-robot"></i></span>
                        <h1 ref={this.elTitle as any}>{this.props.title}</h1>
                        <a href="#" className="close" onClick={this.onCloseClick}><i className="fas fa-times"></i></a>
                    </div>
                    <div className="content">
                        <p>Dialog...</p>
                    </div>  
                    <div className="resize"><div ref={this.elResize as any} onMouseDown={this.onTitleBarMouseDown} onTouchStart={this.onTitleBarMouseDown}>&nbsp;</div></div>
                </div>
            );
        }
    }
}

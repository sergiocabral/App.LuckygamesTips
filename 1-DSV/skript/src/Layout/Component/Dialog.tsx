namespace Layout.Component {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const all: Core.All;

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
     * Tipo para states do React deste componente.
     */
    type State = {
    }

    /**
     * Janela base que contem outros componentes.
     */
    export class Dialog extends React.Component<Props, Partial<State>> {

        /**
         * Registra o código CSS para este componente.
         * @param {string} className Nome da classe para este componente.
         */
        private loadStylesheetCode(className: string): void {
            const base = `.${Presentation.className} .${className}`;
            const theme = new Theme.Stylesheet(all.data.colors);

            const defaults: any = {
                width: 400,
                height: 200
            };

            Util.DOM.stylesheetCode(`
            ${base} {
                z-index: ${theme.zIndex};
                background: ${theme.generalBackground};
                box-shadow: 0 0 20px black;
                border-radius: 7px;
                position: fixed;
                left: calc(50% - ${defaults.width / 2}px);
                top: calc(50% - ${defaults.height / 2}px);
                min-width: 200px;
                min-height: 100px;
                width: ${defaults.width}px;
                height: ${defaults.height}px;
            }
            ${base} .header {
                background-color: ${theme.dialogTitleBackground};
                border-bottom: 1px solid ${Util.Drawing.blend(0.8, theme.dialogTitleTextColor)};
                border-radius: 7px 7px 0 0;
                padding: 9px 0 8px 0;
                cursor: pointer;
                position: relative;
            }
            ${base} .header h1 {
                color: ${theme.dialogTitleTextColor};
                font-family: ${theme.dialogTextFont};
                white-space: nowrap;
                margin: 0 10px;                
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 85%;
            }
            ${base} .header .icon {
                color: ${theme.dialogTitleTextColor};
                font-size: 20px;
                float: left;
                margin: -3px 9px 0 11px;
                opacity: 1;
            }
            ${base} .header a.close {
                color: ${Util.Drawing.blend(0.3, theme.dialogTitleTextColor)};
                position: absolute;
                right: 13px;
                top: 12px;
                font-size: 13px;
            }
            ${base} .header a.close:hover {
                color: ${theme.dialogTitleTextColor};
            }
            ${base} .content * {
                margin: 5px 10px;
            }
            ${base} .content * {
                font-family: ${theme.generalTextFont};
                font-size: 14px;              
            }
            ${base} .content > * {
                margin-left: 10px;
                margin-right: 10px;
            }
            ${base} .content > *:first-child {
                margin-top: 5px;
            }  
            ${base} .content > *:last-child {
                margin-bottom: 5px;
            }
            ${base} .resize {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 15px;
                overflow: hidden;
            }
            ${base} .resize div {
                width: 20px;
                height: 20px;
                background-color: ${Util.Drawing.blend(0.7, theme.generalTextColor)};
                float: right;
                transform: rotate(45deg);
                position: relative;
                top: 10px;
                left: 10px;
                cursor: nw-resize;
            }          
            `);
        }

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);

            this.state = { };

            this.elContainer = React.createRef();
            this.elTitle = React.createRef();
            this.elResize = React.createRef();
            
            this.onBarMouseDown = this.onBarMouseDown.bind(this);
        }

        /**
         * Referência ao container pai de todos.
         * @type {React.RefObject<{}>}
         */
        private elContainer: React.RefObject<{}>;

        /**
         * Referência para o título na barra.
         * @type {React.RefObject<{}>}
         */
        private elTitle: React.RefObject<{}>;

        /**
         * Referência para o botão de resize.
         * @type {React.RefObject<{}>}
         */
        private elResize: React.RefObject<{}>;

        /**
         * Ajusta o título para sempre caber ma barra.
         */
        private adjustTitleWidth(): void {
            const elContainer = this.elContainer.current as HTMLDivElement;
            const elTitle = this.elTitle.current as HTMLHeadElement;
            elTitle.style.width = (elContainer.clientWidth - 80) + "px";
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
        private onBarMouseDown(ev: any): void {
            this.controlMoviment.elementToMove = this.elContainer.current as HTMLDivElement;
            this.controlMoviment.isDown = true;

            this.controlMoviment.isResize = ev.target.parentNode.className.indexOf("resize") >= 0;

            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            this.controlMoviment.offset = [
                this.controlMoviment.elementToMove.offsetLeft - clientX,
                this.controlMoviment.elementToMove.offsetTop - clientY
            ];

            window.cancelAnimationFrame(window.requestAnimationFrame(this.onBarFrameAnimation)); //Linha sem efeito. Necessária para suprimir warning 'declared but never read'.
            window.anything.componentDialogControlMoviment = this.controlMoviment;

            window.addEventListener('mouseup', this.onBarMouseUp);
            window.addEventListener('mousemove', this.onBarMouseMove);
            this.controlMoviment.elementToMove.addEventListener('touchend', this.onBarMouseUp);
            this.controlMoviment.elementToMove.addEventListener('touchmove', this.onBarMouseMove);
        }

        /**
         * Handler para quando o mouse é liberado e para de arrastar.
         */
        private onBarMouseUp(): void {
            if (!window.anything.componentDialogControlMoviment) return;
            const _this = window.anything.componentDialogControlMoviment._this;

            window.removeEventListener('mouseup', _this.onBarMouseUp);
            window.removeEventListener('mousemove', _this.onBarMouseMove);
            _this.controlMoviment.elementToMove.removeEventListener('touchend', _this.onBarMouseUp);
            _this.controlMoviment.elementToMove.removeEventListener('touchmove', _this.onBarMouseMove);

            window.cancelAnimationFrame(_this.idFrameAnimation);
            _this.controlMoviment.isDown = false;
            _this.controlMoviment.wasMoving = false;

            delete window.anything.componentDialogControlMoviment;
        }

        /**
         * Handler para movimento do mouse pela janela (window).
         * @param {any} ev 
         */
        private onBarMouseMove(ev: any): void {
            ev.preventDefault();

            if (!window.anything.componentDialogControlMoviment) return;
            const _this = window.anything.componentDialogControlMoviment._this;

            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            if (_this.controlMoviment.isDown) {
                _this.controlMoviment.mousePosition = {        
                    x: clientX,
                    y: clientY        
                };

                if (!_this.controlMoviment.wasMoving) {
                    _this.controlMoviment.wasMoving = true;
                    _this.controlMoviment.idFrameAnimation = window.requestAnimationFrame(_this.onBarFrameAnimation);
                }
            }
        }

        /**
         * Função usada para animar o movimento da janela.
         */
        private onBarFrameAnimation(): void {
            if (!window.anything.componentDialogControlMoviment) return;
            const _this = window.anything.componentDialogControlMoviment._this;

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

            _this.controlMoviment.idFrameAnimation = window.requestAnimationFrame(_this.onBarFrameAnimation);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const id = Util.String.random();
            const className = "dialog";
            this.loadStylesheetCode(className);

            const jsx = (
                <div id={id} className={className} ref={this.elContainer as any}>
                    <div className="header" onMouseDown={this.onBarMouseDown} onTouchStart={this.onBarMouseDown}>
                        <span className="icon"><i className="fas fa-robot"></i></span>
                        <h1 ref={this.elTitle as any}>{this.props.title}</h1>
                        <a href="#" className="close"><i className="fas fa-times"></i></a>
                    </div>
                    <div className="content">
                        <p>Dialog...</p>
                    </div>  
                    <div className="resize"><div ref={this.elResize as any} onMouseDown={this.onBarMouseDown} onTouchStart={this.onBarMouseDown}>&nbsp;</div></div>
                </div>
            );

            return jsx;
        }
        
        /**
         * Após montagem do componente.
         */
        public componentDidMount(): void {
            this.adjustTitleWidth();
        }

    }
}

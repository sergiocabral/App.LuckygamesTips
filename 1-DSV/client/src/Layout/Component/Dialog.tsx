namespace Layout.Component {

    /**
     * Tipo para props do React deste componente.
     */
    type DialogProps = {

        /**
         * Tema de cores para configurar o layout.
         */
        colors: Theme.Colors,

        /**
         * Título da janela de diálogo.
         */
        title: string
    }

    /**
     * Janela base que contem outros componentes.
     */
    export class Dialog extends React.Component<DialogProps> {

        /**
         * Registra o código CSS para este componente.
         * @param {string} className Nome da classe para este componente.
         */
        private loadStylesheetCode(className: string): void {
            const base = `.${Presentation.className} > .${className}`;
            const theme = new Theme.Stylesheet(this.props.colors);

            Util.DOM.stylesheetCode(`
            ${base} {
                z-index: ${theme.zIndex};
                background: ${theme.generalBackground};
                box-shadow: 0 0 20px black;
                border-radius: 7px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                min-width: 200px;
                min-height: 100px;
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
            `);
        }

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: DialogProps) {
            super(props);
            
            this.elContainer = React.createRef();
            this.elTitle = React.createRef();
            
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
         * Coleção de informações sobre a movimentação da janela de diálogo.
         * @type {any}
         */
        private controlMoviment: any = {
            isDown: false,
            startMoving: false,
            offset: [0, 0],
            mousePosition: { x: 0, y: 0 },
            container: undefined,            
            onBarMouseUp: this.onBarMouseUp,
            onBarMouseMove: this.onBarMouseMove,
            idBarFrameAnimation: undefined,
            onBarFrameAnimation: this.onBarFrameAnimation
        };

        /**
         * Handler para clique do mouse para começar a arrastar
         * @param {any} ev 
         */
        private onBarMouseDown(ev: any): void {
            const controlMoviment = this.controlMoviment;

            controlMoviment.container = this.elContainer.current as HTMLDivElement;
            controlMoviment.isDown = true;
            controlMoviment.offset = [
                controlMoviment.container.offsetLeft - ev.clientX,
                controlMoviment.container.offsetTop - ev.clientY
            ];

            window.anything.componentDialogControlMoviment = controlMoviment;
            window.addEventListener('mouseup', controlMoviment.onBarMouseUp);
            window.addEventListener('mousemove', controlMoviment.onBarMouseMove);
        }

        /**
         * Handler para quando o mouse é liberado e para de arrastar.
         */
        private onBarMouseUp(): void {
            const controlMoviment = window.anything.componentDialogControlMoviment;
            if (!controlMoviment) return;

            window.cancelAnimationFrame(controlMoviment.idBarFrameAnimation);
            window.removeEventListener('mousemove', controlMoviment.onBarMouseMove);
            window.removeEventListener('mouseup', controlMoviment.onBarMouseUp);
            delete window.anything.componentDialogControlMoviment;
            controlMoviment.isDown = false;
            controlMoviment.startMoving = false;
        }

        /**
         * Handler para movimento do mouse pela janela (window).
         * @param {any} ev 
         */
        private onBarMouseMove(ev: any): void {
            ev.preventDefault();

            const controlMoviment = window.anything.componentDialogControlMoviment;
            if (!controlMoviment) return;

            if (controlMoviment.isDown) {
                controlMoviment.mousePosition = {        
                    x: ev.clientX,
                    y: ev.clientY        
                };

                if (!controlMoviment.startMoving) {
                    controlMoviment.startMoving = true;
                    controlMoviment.idBarFrameAnimation = window.requestAnimationFrame(controlMoviment.onBarFrameAnimation);
                }
            }
        }

        /**
         * Função usada para animar o movimento da janela.
         */
        private onBarFrameAnimation(): void {
            const controlMoviment = window.anything.componentDialogControlMoviment;
            if (!controlMoviment) return;

            controlMoviment.container.style.left = 
                (controlMoviment.mousePosition.x + controlMoviment.offset[0]) + 'px';
            controlMoviment.container.style.top = 
                (controlMoviment.mousePosition.y + controlMoviment.offset[1]) + 'px';

            controlMoviment.idBarFrameAnimation = window.requestAnimationFrame(controlMoviment.onBarFrameAnimation);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const id = "_" + btoa(String(Math.random())).substr(5, 5);
            const className = "dialog";
            this.loadStylesheetCode(className);

            const jsx = (
                <div id={id} className={className} ref={this.elContainer as any}>
                    <div className="header" onMouseDown={this.onBarMouseDown}>
                        <span className="icon"><i className="fas fa-robot"></i></span>
                        <h1 ref={this.elTitle as any}>{this.props.title}</h1>
                        <a href="#" className="close"><i className="fas fa-times"></i></a>
                    </div>
                    <div className="content">
                        <p>Dialog...</p>
                    </div>                    
                </div>
            );

            return jsx;
        }
        
        /**
         * Após montagem do componente.
         */
        public componentDidMount(): void {
            //Ajusta o título para sempre caber ma barra.
            const elContainer = this.elContainer.current as HTMLDivElement;
            const elTitle = this.elTitle.current as HTMLHeadElement;
            elTitle.style.width = (elContainer.clientWidth - 80) + "px";
        }

    }
}

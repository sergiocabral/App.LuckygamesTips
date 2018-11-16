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
                width: 60%;
                height: 60%;
            }
            ${base} .header {
                background-color: ${theme.dialogTitleBackground};
                border-bottom: 1px solid ${theme.colorLight};
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
                margin: -3px 10px 0 13px;
                opacity: 1;
            }
            ${base} .header a.close {
                color: ${theme.dialogTitleTextColor};
                position: absolute;
                right: 13px;
                top: 12px;
                font-size: 13px;
            }
            ${base} .header a.close:hover {
                color: ${theme.dialogTitleTextColor};
            }
            ${base} .content {
                margin: 5px 10px;
                font-family: ${theme.generalTextFont};
                font-size: 14px;              
            }
            ${base} .content > *:first-child {
                margin-top: 0;
            }  
            ${base} .content > *:last-child {
                margin-bottom: 0;
            }            
            `);
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
                <div id={id} className={className}>
                    <div className="header">
                        <span className="icon"><i className="fas fa-robot"></i></span>
                        <h1>{this.props.title}</h1>
                        <a href="#" className="close"><i className="fas fa-times"></i></a>
                    </div>
                    <div className="content">
                        <p>Dialog...</p>
                    </div>                    
                </div>
            );
            
            return jsx;
        }

    }
}

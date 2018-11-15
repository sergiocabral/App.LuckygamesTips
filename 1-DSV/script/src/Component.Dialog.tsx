namespace Component {

    /**
     * Tipo para props do React deste componente.
     */
    type DialogProps = {

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
         * Indica se o código CSS já foi registrado para este componente.
         */
        private static isLoadedStylesheetCode: boolean = false;

        /**
         * Registra o código CSS para este componente.
         * @param className Nome da classe para este componente.
         */
        private loadStylesheetCode(className: string): void {
            if (Dialog.isLoadedStylesheetCode) return;
            
            const base = `.${Visual.Layout.className} > .${className}`;

            Util.Load.stylesheetCode(`
            ${base} {
                z-index: ${Visual.Theme.zIndex};
                background-color: ${Visual.Theme.backgroundColor};
                box-shadow: 0 0 20px ${Visual.Theme.boxShadowColor};
                border-radius: 7px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60%;
                height: 60%;
            }
            ${base} .header {
                background-color: ${Visual.Theme.backgroundColorTitle};
                border-bottom: 1px solid ${Visual.Theme.borderColorLight};
                border-radius: 7px 7px 0 0;
                padding: 9px 0 8px 0;
                cursor: pointer;
                position: relative;
            }
            ${base} .header h1 {
                color: ${Visual.Theme.colorTitle};
                font-family: ${Visual.Theme.fontFamilyTitle};
                white-space: nowrap;
                margin: 0 10px;                
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 85%;
            }
            ${base} .header .icon {
                color: ${Visual.Theme.colorTitle};
                font-size: 20px;
                float: left;
                margin: -3px 10px 0 13px;
                opacity: 1;
            }
            ${base} .header a.close {
                color: ${Visual.Theme.colorTitle};
                position: absolute;
                right: 13px;
                top: 12px;
                font-size: 13px;
            }
            ${base} .header a.close:hover {
                color: ${Visual.Theme.colorTitleDark};
            }
            ${base} .content {
                margin: 5px 10px;
                font-family: ${Visual.Theme.fontFamilyText};
                font-size: 14px;              
            }
            ${base} .content > *:first-child {
                margin-top: 0;
            }  
            ${base} .content > *:last-child {
                margin-bottom: 0;
            }            
            `);

            Dialog.isLoadedStylesheetCode = true;
        }

        /**
         * Teste
         */
        public render(): JSX.Element {
            const id = "_" + btoa(String(Math.random())).substr(5, 5);
            const className = "Dialog";
            this.loadStylesheetCode(className);

            console.log(id);

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

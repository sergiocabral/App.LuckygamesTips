namespace Skript.Part.System.LogViewer.Component {

    /**
     * Componente principal do módulo.
     */
    export class LogViewer extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {
        
        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                position: relative;
                min-height: 150px;
            }
            ${this.selectorOutDialog()} {
                position: absolute;
                left: 10px;
                top: 10px;
                right: 10px;
                bottom: 10px;
            }
            ${this.selectorInDialog()} {     
            }
            ${this.selector()} > .controls {   
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: calc(35% - 5px);
                overflow-x: hidden;
            }
            ${this.selector()} > .controls > div {
                margin-right: 5px;
                text-align: center;
            }
            ${this.selector()} > .controls > div > .levels {   
                border-bottom: 1px solid gainsboro;
                padding-bottom: 10px;
                margin-bottom: 10px;
                text-align: left;
            }            
            ${this.selector()} > .messages {
                position: absolute;
                left: 35%;
                right: 0;
                height: 100%;
                overflow: auto;
                border-left: 1px solid gainsboro;
            }
            ${this.selector()} > .messages > div {
                margin-left: 5px;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);

            this.title = this.translate("Log Viewer");
            this.icon = "far fa-list-alt";
        }

        /**
         * Nova mensagem de log recebida.
         * @param {Core.Log.Message} message Mensagem
         */
        post(message: Core.Log.Message): void {
            message;
        }

        /**
         * Limpar a lista de log.
         */
        public clear() {
            return;
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    <div className="controls">
                        <div>
                            <LogLevels className="levels"></LogLevels>
                            <button className="button">Clear log</button>
                            <div className="height10"></div>
                        </div>
                    </div>
                    <div className="messages">
                        <div>
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                            messages<br />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

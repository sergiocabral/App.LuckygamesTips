namespace Skript.Part.System.LogViewer.Component {

    /**
     * Componente principal do módulo.
     */
    export class LogViewer extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {
        
        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} table {
                width: 100%;
                height: 100%;
            }
            ${this.selector()} table td,
            ${this.selector()} table th {
                white-space: nowrap;
            }
            ${this.selector()} table th {
            }
            ${this.selector()} .levels {
                padding-right: 10px;
            }
            ${this.selector()} .log {
                background-color: ${Util.Drawing.blend(-0.5, this.theme.generalTextColor)};
                color: ${Util.Drawing.blend(0.5, this.theme.generalBackgroundColor)};
                border: 1px solid ${Util.Drawing.blend(-0.2, this.theme.generalTextColor)};
                overflow: auto;
                font-family: monospace;
                font-size: 80%;
            }
            ${this.selector()} .log > div > * {
                display: block;
                margin: 5px 7px;
            }
            ${this.selector()} .log > div {
                overflow: auto;
                padding: 0;
            }
            ${this.selectorComponent()} .log > div {
                max-height: 230px;
            }            
            ${this.selectorDialog()} .log {
                position: relative;
            }
            ${this.selectorDialog()} .log > div {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }
            ${this.selectorDialog()} > div {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;                
                bottom: 0;
                overflow: hidden;
                min-height: 260px;
                padding-bottom: 20px;
                margin-bottom: 0 !important;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);

            new LogViewerBus(this);

            this.elMessages = React.createRef();

            this.title = this.translate("Log Viewer");
            this.icon = "far fa-list-alt";
        }

        /**
         * Container das mensagens
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elMessages: React.RefObject<HTMLDivElement>;

        /**
         * Nova mensagem de log recebida.
         * @param {Core.Log.Message} message Mensagem
         */
        post(message: Core.Log.Message): void {
            console.log(message);
        }
        
        /**
         * Níveis disponíveis para visualizar.
         * @type {Core.Log.Level[]} Lista de níveis.
         */
        private levels(): Core.Log.Level[] {
            const result: Core.Log.Level[] = [];

            result.push(Core.Log.Level.Information);
            result.push(Core.Log.Level.Warning);
            result.push(Core.Log.Level.Error);

            if (this.debug()) {
                result.push(Core.Log.Level.Debug);
                result.push(Core.Log.Level.DebugBus);
                result.push(Core.Log.Level.DebugDOM);
                result.push(Core.Log.Level.DebugReact);
                result.push(Core.Log.Level.DebugRequest);
            }

            return result;
        };

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <table>
                    <thead>
                        <tr>
                            <th><h1>Níveis</h1></th>
                            <th><h1>Mensagens</h1></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="levels">
                                {this.levels().map(v => 
                                    <div><Layout.ReactJs.Component.Switch checked={true} value={v}>{Core.Log.Level[v]}</Layout.ReactJs.Component.Switch></div>
                                )}
                            </td>
                            <td className="log width100">
                                <div ref={this.elMessages}></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
    }
}

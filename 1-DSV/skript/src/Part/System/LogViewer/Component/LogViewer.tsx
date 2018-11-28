namespace Skript.Part.System.LogViewer.Component {

    /**
     * Consjute para State deste componente.
     */
    type LogViewerState = {

        /**
         * Total de mensagens
         * @type {number}
         */
        messages: number;
    }

    /**
     * Mensagem do log enriquecida.
     */
    type MessageWrapper = {

        /**
         * Mensagem do log.
         * @type {Core.Log.Message}
         */
        message: Core.Log.Message,

        /**
         * Determina se deve ser exibido ou não.
         * @type {boolean}
         */
        hide: boolean
    }

    /**
     * Componente principal do módulo.
     */
    export class LogViewer extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<LogViewerState>> {
        
        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} table {
                width: 100%;
                height: 100%;
            }
            ${this.selector()} table td:not(.log),
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
                max-height: 260px;
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
                min-height: 290px;
                padding-bottom: 20px;
                margin-bottom: 0 !important;
            }
            @keyframes LogViewer-Blink {
                from { background-color: lightslategrey; }
	            to { background-color: transparent; }
            }
            ${this.selector()} .log .item .time {
                background-color: rgba(255,255,255,0.1);
                color: silver;
                display: block;
                text-align: right;
            }
            ${this.selector()} .log .item .text {
                display: block;
                margin: 3px 0 6px 0;
                padding: 0 10px;
                word-break: break-word;
                animation: LogViewer-Blink 1s forwards;
            }
            ${this.selector()} .log .item .level {
                background-color: rgba(255, 255, 255, 0.8);
                color: black;
                padding: 0 10px;                
                border-radius: 2px;
                float: left;
                margin-right: 5px;
            }                  
            ${this.selector()} .log .item.Information .level {
                background-color: #0062C9;
                color: white;
            }          
            ${this.selector()} .log .item.Debug .level {
                color: gray;
            }          
            ${this.selector()} .log .item.Warning .level {
                background-color: #ffc107;
            }          
            ${this.selector()} .log .item.Error .level {
                background-color: #dc3545;
                color: white;
            }
            ${this.selector()} .controls {
                padding-top: 10px;
                text-align: center;
                height: 100%;
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

            this.onLevelClick = this.onLevelClick.bind(this);
            this.onClearClick = this.onClearClick.bind(this);
            
            this.elMessages = React.createRef();

            const messageBus = new Core.Message.GetLogMessages().sendSync() as Core.Message.GetLogMessages;
            this.messages = [];
            if (messageBus.result) messageBus.result.messages.reverse().map(v => this.post(v));            
            this.myMessageBus.push(new LogViewerBus(this));
        }

        /**
         * Objeto que contem as mensagens.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elMessages: React.RefObject<HTMLDivElement>;

        /**
         * Lista de todas as mensagens de log.
         * @type {MessageWrapper[]}
         */
        private messages: MessageWrapper[];

        /**
         * Nova mensagem de log recebida.
         * @param {Core.Log.Message} message Mensagem
         */
        post(message: Core.Log.Message): void {
            this.messages.unshift({
                message: message,
                hide: this.levelToHide.indexOf(Core.Log.Level[message.level]) >= 0
            });
            if (this.elMessages.current) this.setState({ messages: this.messages.length });
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
         * Lista de levels para não exibir.
         */
        private levelToHide: string[] = [];

        /**
         * Quando clica em um nível de log para filtrar.
         */
        private onLevelClick(evt: any): void {
            const input = evt.target as HTMLInputElement;
            const checked = input.checked;
            const level = input.value;
            const elements = document.querySelectorAll(`#${this.id()} .${level}`);
            
            for (let i = 0; i < elements.length; i++) (elements[i] as HTMLElement).style.display = checked ? "" : "none";
            
            if (!checked && this.levelToHide.indexOf(level) < 0) this.levelToHide.push(level);
            else if (checked && this.levelToHide.indexOf(level) >= 0) this.levelToHide.splice(this.levelToHide.indexOf(level), 1);
        }

        /**
         * Ao limpar log.
         */
        private onClearClick() {
            console.log("clear");
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <table id={this.id()}>
                    <thead>
                        <tr>
                            <th><h1>Níveis</h1></th>
                            <th><h1>Mensagens</h1></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="levels" onClick={this.onLevelClick}>
                                {this.levels().map(v => 
                                    <div><Layout.ReactJs.Component.Switch checked={true} value={Core.Log.Level[v]}>{Core.Log.Level[v]}</Layout.ReactJs.Component.Switch></div>
                                )}
                            </td>
                            <td className="log width100" rowSpan={2}>
                                <div ref={this.elMessages}>
                                    {this.messages.map(v => 
                                        <div key={v.message.id} data-id={v.message.id} className={"item " + Core.Log.Level[v.message.level]} style={ { display: v.hide ? "none" : ""} }>
                                            <span className="level">{Core.Log.Level[v.message.level]}</span>
                                            <span className="time">{v.message.time.format({})}</span>
                                            <span className="text">{v.message.text}</span>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="controls">
                                <button className="button" onClick={this.onClearClick}>{this.translate("Clear")}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
    }
}

namespace Skript.Business.Parts.LogViewer {

    /**
     * Componente: Principal do módulo.
     */
    export class LogViewer extends Layout.Components.DialogHeader.Content<Framework.Layout.Components.EmptyProps, LogViewerState> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} {
                    position: relative;
                }
                ${this.classNameSelectorOutDialog()} {
                    min-height: 320px;
                }
                ${this.classNameSelectorInDialog()} {
                    position: absolute;
                    left: ${this.theme.spacing}px;
                    top: ${this.theme.spacing}px;
                    right: ${this.theme.spacing}px;
                    bottom: ${this.theme.spacing}px;
                }
                ${this.classNameSelector()} > .controls {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: calc(35% - ${this.theme.spacing / 2}px);
                    overflow-x: hidden;
                }
                ${this.classNameSelector()} > .controls > div {
                    margin-right: ${this.theme.spacing / 2}px;
                    text-align: center;
                }
                ${this.classNameSelector()} > .controls > div > select,
                ${this.classNameSelector()} > .controls > div > .select2 {
                    width: 100% !important;
                }
                ${this.classNameSelector()} > .controls > div > .select2 + .spacing {
                    border-bottom: 1px solid gainsboro;
                    margin-bottom: 5px;
                }
                ${this.classNameSelector()} > .controls > div > .levels {
                    text-align: left;
                }
                ${this.classNameSelector()} > .controls > div > .switch {
                    text-align: left;
                }
                ${this.classNameSelector()} > .messages {
                    position: absolute;
                    left: 35%;
                    right: 0;
                    height: 100%;
                    overflow: auto;
                    border-left: 1px solid gainsboro;
                }
                ${this.classNameSelector()} > .messages > div {
                    margin-left: ${this.theme.spacing / 2}px;
                    font-size: 80%;
                }
                @keyframes LogViewer-Slide {
                    100% { left: 0; }
                }
                ${this.classNameSelector()} > .messages > div > .level {
                    background-color: ${Framework.Util.Drawing.blend(-0.02, this.theme.generalBackgroundColor)};
                    margin: 0 ${this.theme.spacing / 2}px 5px 0;
                    padding: 5px 6px 3px 6px;
                    border-radius: 5px;
                }
                ${this.classNameSelector()} > .messages > div > .level.new {
                    position: relative;
                    left: -110%;
                    animation: LogViewer-Slide 0.5s forwards;
                }
                ${this.classNameSelector()} > .messages > div > .level.Information {
                    background-color: #B9E3F2;
                }
                ${this.classNameSelector()} > .messages > div > .level.Warning {
                    background-color: #FFE3A7;
                }
                ${this.classNameSelector()} > .messages > div > .level.Error {
                    background-color: #FFCBD1;
                }
                ${this.classNameSelector()} > .messages > div > .level.Debug {
                    background-color: ${Framework.Util.Drawing.blend(-0.1, this.theme.generalBackgroundColor)};
                }
                ${this.classNameSelector()} > .messages > div > .level .type {
                    display: inline-block;
                    background-color: rgba(0, 0, 0, 0.25);
                    color: white;
                    border-radius: 4px;
                    padding: 1px 5px 3px 5px;
                    margin: 0 6px 2px -3px;
                }
                ${this.classNameSelector()} > .messages > div > .level .type + .type {
                    background-color: rgba(0, 0, 0, 0.10);
                    color: darkgray;
                }
                ${this.classNameSelector()} > .messages > div > .level .time {
                    color: ${Framework.Util.Drawing.blend(0.5, this.theme.generalTextColor)};
                    display: inline-block;
                    float: right;
                    margin-top: 1px;
                }
                ${this.classNameSelector()} > .messages > div > .level .text {
                    word-break: break-word;
                    font-family: 'Share Tech Mono', monospace;
                    line-height: 13px;
                    margin-top: 3px;
                }
            `;
        }

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);

            this.title = "Log Viewer";
            this.icon = "far fa-list-alt";

            const messages = new Framework.Messages.GetLogMessages().request().messages;
            if (!messages) throw new Framework.Errors.EmptyValue("Log messages is not defined.");
            this.state = { messages: messages.reverse() };

            this.toCaptureOff.push(Framework.Bus.Message.capture(Framework.Messages.DidLogCleared, this, this.onDidLogCleared));
            this.toCaptureOff.push(Framework.Bus.Message.capture(Framework.Messages.DidLogPosted, this, this.onDidLogPosted));

            this.elClearLog = React.createRef();
            this.elFilter = React.createRef();
            this.elLevels = React.createRef();

            this.onChange = this.onChange.bind(this);
            this.onClearLogClick = this.onClearLogClick.bind(this);

            const obj = this;
            obj;
            eval("window.obj = obj");
        }

        /**
         * Adiciona parâmetros para automação deste componente.
         */
        protected configureAutomation(parameters: Framework.Types.Index<Framework.Types.Parameter<any>>, actions: Framework.Types.Index<Framework.Types.Action>): void {
            const filters: Framework.Types.Parameter<string[]> = {
                name: "Filters",
                get: (): string[] => {
                    if (!this.elFilter.current) throw new Framework.Errors.ReactNotReady();
                    return this.elFilter.current.value().map(v => v.key);
                },
                set: (value: string[]): boolean => {
                    if (!this.elFilter.current) throw new Framework.Errors.ReactNotReady();
                    if (!Array.isArray(value) ||
                    value.filter(v => typeof(v) !== "string" || !v).length) return false;
                    this.elFilter.current.value(value);
                    return true;
                }
            };
            parameters[filters.name] = filters;

            const levels: Framework.Types.Parameter<string[]> = {
                name: "Levels",
                get: (): string[] => {
                    if (!this.elLevels.current) throw new Framework.Errors.ReactNotReady();
                    return this.elLevels.current.checkeds().map(v => Framework.Log.Level[v]);
                },
                set: (value: string[]): boolean => {
                    if (!this.elLevels.current) throw new Framework.Errors.ReactNotReady();
                    if (!Array.isArray(value) ||
                    value.filter(v => typeof(v) !== "string").length ||
                    value.filter(v => Framework.Log.Level[v as any] === undefined).length) return false;
                    this.elLevels.current.checkeds(value.map(v => Framework.Log.Level[v as any] as any));
                    this.onChange();
                    return true;
                }
            };
            parameters[levels.name] = levels;

            const clear: Framework.Types.Action = {
                name: "Clear Log",
                execute: (): void => {
                    if (!this.elClearLog.current) throw new Framework.Errors.ReactNotReady();
                    this.elClearLog.current.click();
                }
            }
            actions[clear.name] = clear;
        }

        /**
         * Botão limpar log.
         * @type {React.RefObject<HTMLButtonElement>}
         */
        private elClearLog: React.RefObject<HTMLButtonElement>;

        /**
         * Filtro.
         * @type {React.RefObject<Framework.Layout.Components.Select.Select>}
         */
        private elFilter: React.RefObject<Framework.Layout.Components.Select.Select>;

        /**
         * Níveis de log.
         * @type {React.RefObject<Levels>}
         */
        private elLevels: React.RefObject<Levels>;

        /**
         * Mensagem: ao limpar o log.
         */
        private onDidLogCleared(): void {
            this.setState({ messages: [] });
        }

        /**
         * Lista das últimas mensagens.
         * @type {number[]}
         */
        private lastMessages: number[] = [];

        /**
         * Timeout para exibição do log de forma tardia.
         */
        private onDidLogPostedTimeout: NodeJS.Timeout = undefined as any;

        /**
         * Lista de logs para exibição tardia.
         */
        private onDidLogPostedDelayList: Framework.Log.Message[] = [];

        /**
         * Mensagem: ao receber uma mensagem no log.
         * @type {Framework.Messages.DidLogPosted} message Mensagem
         */
        private onDidLogPosted(message: Framework.Messages.DidLogPosted): void {
            this.onDidLogPostedDelayList.push(message.log);
            clearTimeout(this.onDidLogPostedTimeout);
            this.onDidLogPostedTimeout = setTimeout(() => {
                this.lastMessages = this.onDidLogPostedDelayList.map(v => v.id);
                const messages: Framework.Log.Message[] = this.state.messages;
                let message: Framework.Log.Message | undefined;
                while (message = this.onDidLogPostedDelayList.shift()) messages.unshift(message);
                this.setState({ messages: messages });
                setTimeout(() => this.lastMessages.length = 0, 1000);
            }, 1000);
        }

        /**
         * Extrai todas as orígens contidas nas mensagens de log.
         * @param messages Lista de mensagens de log.
         * @returns {string[]} Lista de orígens.
         */
        private extractOrigins(messages: Framework.Log.Message[]): string[] {
            const result: string[] = [];
            messages.forEach(message => {
                if (message.origin && result.indexOf(message.origin) < 0)
                    result.push(message.origin);
            });
            result.sort();
            return result;
        }

        /**
         * Evento: ao limpar todo o log.
         */
        private onClearLogClick(): void {
            new Framework.Messages.DoLogClear().send();
        }

        /**
         * Valida se uma mensagem passa pelo filtro atual.
         * @param message Mensagem
         */
        private filter(message: Framework.Log.Message): boolean {
            if (!this.elFilter.current || !this.elLevels.current) return true;
            const levels = this.elLevels.current.checkeds();
            const filters = this.elFilter.current.value();
            return (
                levels.indexOf(message.level) >= 0 && (
                    filters.length === 0 ||
                    filters.filter(v =>
                        message.origin === v.key ||
                        message.text.toLowerCase().indexOf(v.key.toLowerCase()) >= 0
                    ).length > 0
                )
            );
        }

        /**
         * Evento: ao alterar seleção.
         */
        private onChange(): void {
            this.forceUpdate();
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    <div className="controls">
                        <div>
                            <Framework.Layout.Components.Select.Select
                                ref={this.elFilter}
                                placeholder={"Filter".translate()}
                                multiple={true}
                                tags={true}
                                onChange={this.onChange}>
                                {this.extractOrigins(this.state.messages).map(origin =>
                                    <option key={origin} value={origin}>{origin.translate()}</option>
                                )}
                            </Framework.Layout.Components.Select.Select>
                            <div className="spacing"></div>
                            <div className="levels">
                                <Levels
                                    ref={this.elLevels}
                                    className="levels"
                                    onChange={this.onChange}>
                                </Levels>
                            </div>
                            <div className="spacing"></div>
                            <button 
                                ref={this.elClearLog}
                                className="button" 
                                onClick={this.onClearLogClick}>
                                {"Clear log".translate()}
                            </button>
                            <div className="spacing"></div>
                        </div>
                    </div>
                    <div className="messages">
                        <div>
                            {this.state.messages.filter(message => this.filter(message)).map(message =>
                                <div key={message.id} className={"level " + Framework.Log.Level[message.level] + (this.lastMessages.indexOf(message.id) >= 0 ? " new" : "")}>
                                    <div className="time">{message.time.format()}</div>
                                    <div className="type">{Framework.Log.Level[message.level].translate()}</div>
                                    { message.origin ? <div className="type">{message.origin.translate()}</div> : undefined }
                                    <div className="text">{message.text}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }

    Base.toAppendToMainDialog.push(LogViewer);
}

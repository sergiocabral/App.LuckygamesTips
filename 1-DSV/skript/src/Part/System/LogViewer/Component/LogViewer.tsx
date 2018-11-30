namespace Skript.Part.System.LogViewer.Component {

    /**
     * Mensagens de log enriquecida.
     */
    class MessageWrapper {

        /**
         * Construtor.
         * @param {Core.Log.Message} message Mensagem de log.
         */
        public constructor(message: Core.Log.Message) {
            this.message = message;
        }

        /**
         * Indica que é uma nova mensagem
         * @type {boolean}
         */
        new: boolean = true;

        /**
         * Mensagem de log.
         * @type {Core.Log.Message}
         */
        message: Core.Log.Message;
    }

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
                font-size: 80%;
            }
            @keyframes LogViewer-Slide {
                100% { left: 0; }
            }
            ${this.selector()} > .messages > div > .level {
                background-color: ${Util.Drawing.blend(-0.02, this.theme.generalBackgroundColor)};
                margin: 0 5px 5px 0;
                padding: 3px 6px;
                border-radius: 5px;
            }
            ${this.selector()} > .messages > div > .level.new {
                position: relative;
                left: -110%;
                animation: LogViewer-Slide 0.5s forwards;
            }
            ${this.selector()} > .messages > div > .level.Information {
                background-color: #B9E3F2;
            }
            ${this.selector()} > .messages > div > .level.Warning {
                background-color: #FFE3A7;
            }
            ${this.selector()} > .messages > div > .level.Error {
                background-color: #FFCBD1;
            }
            ${this.selector()} > .messages > div > .level.Debug {
                background-color: ${Util.Drawing.blend(-0.1, this.theme.generalBackgroundColor)};
            }
            ${this.selector()} > .messages > div > .level .type {
                display: inline-block;
                background-color: rgba(0, 0, 0, 0.25);
                color: white;
                border-radius: 4px;
                padding: 1px 5px 0px 5px;
            }
            ${this.selector()} > .messages > div > .level .time {
                color: ${Util.Drawing.blend(0.5, this.theme.generalTextColor)};
                display: inline-block;
                float: right;
            }
            ${this.selector()} > .messages > div > .level .text {
                word-break: break-word;
                font-family: 'Share Tech Mono', monospace;
                line-height: 13px;
                margin-top: 3px;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);

            this.myMessageBus.push(new LogViewerBus(this));

            this.title = this.translate("Log Viewer");
            this.icon = "far fa-list-alt";

            this.elContainer = React.createRef();

            this.onLogLevelsChange = this.onLogLevelsChange.bind(this);
            this.onClearLogClick = this.onClearLogClick.bind(this);            

            const message = new Core.Message.GetLogMessages().sendSync() as Core.Message.GetLogMessages;
            if (!message.result) throw new Core.Errors.NullNotExpected("Message.GetLogMessages.result");
            message.result.messages.map(v => this.messages.unshift(new MessageWrapper(v)));
        }
        
        /**
         * Referência ao container pai de todos.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContainer: React.RefObject<HTMLDivElement>;
        
        /**
         * Lista de mensagens de log.
         * @type {MessageWrapper[]}
         */
        private messages: MessageWrapper[] = [];

        /**
         * Nova mensagem de log recebida.
         * @param {Core.Log.Message} message Mensagem
         */
        post(message: Core.Log.Message): void {
            this.messages.unshift(new MessageWrapper(message));
            this.update();
        }

        /**
         * Limpar a lista de log.
         */
        public clear() {
            this.messages.length = 0;
            this.update();
        }

        /**
         * Solicita ao React a atualização do componente se já for possível.
         */
        private update(): void {
            if (this.elContainer.current) this.forceUpdate();
        }

        /**
         * Lista de níveis de log não marcados para exibição.
         * @type {Core.Log.Level[]}
         */
        private uncheckeds: Core.Log.Level[] = [];

        /**
         * Ao trocar a seleção.
         * @param {Core.Log.Level} level Valor acionado.
         * @param {boolean} checked Novo estado do valor acionado.
         */
        private onLogLevelsChange(level: Core.Log.Level, checked: boolean): void {
            if (checked && this.uncheckeds.indexOf(level) >= 0) this.uncheckeds.splice(this.uncheckeds.indexOf(level), 1);
            else if (!checked && this.uncheckeds.indexOf(level) < 0) this.uncheckeds.push(level);
            this.update();
        }

        /**
         * Evento para limpar a lista de log.
         */
        private onClearLogClick(): void {
            new Core.Message.ClearLogMessages().sendSync();
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {
            const messages = this.messages.filter(v => this.uncheckeds.indexOf(Number(v.message.level)) < 0).slice();
            
            setTimeout(() => { 
                let needUpdate = false;
                messages.map(v => { if (v.new) { v.new = false; needUpdate = true; } });
                if (needUpdate) this.update();
            }, 500);

            return (
                <div id={this.id()} className={this.className()} ref={this.elContainer}>
                    <div className="controls">
                        <div>
                            <LogLevels className="levels" onChange={this.onLogLevelsChange}></LogLevels>
                            <button className="button" onClick={this.onClearLogClick}>{this.translate("Clear log")}</button>
                            <div className="height10"></div>
                        </div>
                    </div>
                    <div className="messages">
                        <div>
                            {messages.map(v =>                                
                                <div key={v.message.id} className={"level " + Core.Log.Level[v.message.level] + (v.new ? " new" : "")}>
                                    <div className="type">{this.translate(Core.Log.Level[v.message.level])}</div>
                                    <div className="time">{v.message.time.format({})}</div>
                                    <div className="text">{v.message.text}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

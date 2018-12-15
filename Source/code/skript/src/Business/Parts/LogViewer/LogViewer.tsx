namespace Skript.Business.Parts.LogViewer {

    /**
     * Componente: Principal do módulo.
     */
    export class LogViewer extends Layout.Components.DialogHeader.Content {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} {
                    position: relative;
                }
                ${this.classNameSelectorOutDialog()} {
                    min-height: ${this.theme.debug ? "375px" : "210px"};
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
                ${this.classNameSelector()} > .controls > div > .levels {
                    border-bottom: 1px solid gainsboro;
                    padding-bottom: ${this.theme.spacing}px;
                    margin-bottom: ${this.theme.spacing / 2}px;
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
                    margin: 0 0 0 -3px;
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
                            <div className="levels">Niveis aqui</div>
                            <Framework.Layout.Components.Switch.Switch className="switch" checked={true}>{"All".translate()}</Framework.Layout.Components.Switch.Switch>
                            <div className="spacing"></div>
                            <button className="button">{"Clear log".translate()}</button>
                            <div className="spacing"></div>
                        </div>
                    </div>
                    <div className="messages">
                        <div>
                            {[1,2,3].map(v =>
                                <div key={v} className={"level " + Framework.Log.Level[Framework.Log.Level.Information] + (!!"new" ? " new" : "")}>
                                    <div className="type">{Framework.Log.Level[Framework.Log.Level.Information].translate()}</div>
                                    <div className="time">{new Date().format()}</div>
                                    <div className="text">{Framework.Util.Text.random(undefined, 130).replace(/[0-9]/gi, " ")}</div>
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

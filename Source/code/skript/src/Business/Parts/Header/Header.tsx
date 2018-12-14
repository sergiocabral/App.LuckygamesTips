namespace Skript.Business.Parts.Header {

    /**
     * Componente principal do módulo.
     */
    export class Header extends Base {

        /**
         * Carrega e aplica os estilos css.
         */
        public css: string = `
            ${this.classNameSelector()} {
                position: relative;
            }
            ${this.classNameSelector()} > .header {
                text-align: center;
                background-image: url("${this.theme.url}/header-background.jpg");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.25);
                padding: 5px 0 5px 150px;
            }
            ${this.classNameSelector()} > .header h1,
            ${this.classNameSelector()} > .header h2,
            ${this.classNameSelector()} > .header h3 {
                margin: 5px 0;
                white-space: nowrap;
                text-shadow: 
                    0 0 20px ${this.theme.generalBackgroundColor},
                    0 0 20px ${this.theme.generalBackgroundColor},
                    0 0 40px ${this.theme.generalBackgroundColor},
                    0 0 40px ${this.theme.generalBackgroundColor},
                    0 0 40px ${this.theme.generalBackgroundColor},
                    0 0 60px ${this.theme.generalBackgroundColor},
                    0 0 60px ${this.theme.generalBackgroundColor},
                    0 0 60px ${this.theme.generalBackgroundColor}, 
                    0 0 60px ${this.theme.generalBackgroundColor};
            }
            ${this.classNameSelector()} > .header h1 {
                color: ${Framework.Util.Drawing.blend(-0.5, this.theme.generalTextColor)};                
                font-family: fast-forward;
                font-size: 100%;
            }
            ${this.classNameSelector()} > .header h2 {
                font-size: 100%;
            }
            ${this.classNameSelector()} > .header h3 {
                font-size: 80%;
            }      
            ${this.classNameSelector()} > .bot {
                background-image: url("${this.theme.url}/r2d2.png");
                background-size: 93%;
                background-repeat: no-repeat;
                background-position: 10px 5px;
                position: absolute;
                top: 0;
                left: 0;
                width: 30%;
                height: calc(100% + 5px);
            }
            ${this.classNameSelector()} > .bar {
                width: calc(100% - 6px);
                text-align: right;
                margin: 2px 0 5px 0;
            }
            ${this.classNameSelector()} > .bar > * {
                display: inline-block;
            }
        `;

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    <div className="header">
                        <h1>{Core.Main.instance.configuration.name.toUpperCase().replaceAll(" ", ".")}</h1>
                        <h2>{"do more, much more".translate()}</h2>
                        <h3><a href={this.theme.url} target="_blank">{Framework.Data.ServerVariables.url.replace(/(^https?\:\/\/|\/$)/gi, "")}</a></h3>
                    </div>
                    <div className="bot"></div>
                    <div className="bar">
                        <Controls />
                    </div>                    
                </div>
            );
        }
    }

    Base.toAppendToMainDialog.push(Header);
}

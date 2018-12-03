namespace Skript.Part.System.MainHeader {

    /**
     * Componente principal do módulo.
     */
    export class MainHeader extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                position: relative;
            }
            ${this.selector()} > .header {
                text-align: center;
                background-image: url(https://dsv.luckygames.tips/media/header-background.jpg);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.25);
                padding: 5px 0 5px 150px;
            }
            ${this.selector()} > .header h1,
            ${this.selector()} > .header h2,
            ${this.selector()} > .header h3 {
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
            ${this.selector()} > .header h1 {
                color: ${Util.Drawing.blend(-0.5, this.theme.generalTextColor)};                
                font-family: fast-forward;
                font-size: 100%;
            }
            ${this.selector()} > .header h2 {
                font-size: 100%;
            }
            ${this.selector()} > .header h3 {
                font-size: 80%;
            }      
            ${this.selector()} > .bot {
                background-image: url("https://dsv.luckygames.tips/media/r2d2.png");
                background-size: 93%;
                background-repeat: no-repeat;
                background-position: 10px 5px;
                position: absolute;
                top: 0;
                left: 0;
                width: 30%;
                height: calc(100% + 5px);
            }
            ${this.selector()} > .bar {
                width: calc(100% - 6px);
                text-align: right;
                margin: 2px 0 5px 0;
            }
            ${this.selector()} > .bar > * {
                display: inline-block;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);            
        }
        
        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    <div className="header">
                        <h1>{this.theme.title.toUpperCase().replaceAll(" ", ".")}</h1>
                        <h2>{this.translate("do more, much more")}</h2>
                        <h3><a href={this.theme.url} target="_blank">{this.theme.url.substr(this.theme.url.indexOf("//") + 2)}</a></h3>
                    </div>
                    <div className="bot"></div>
                    <div className="bar">
                        <Controls />
                        <Layout.ReactJs.Component.LanguageSelect className="language" />
                    </div>                    
                </div>
            );
        }
    }

    new Part("MainHeader", MainHeader);
}

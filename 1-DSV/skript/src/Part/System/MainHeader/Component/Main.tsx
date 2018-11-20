namespace Skript.Part.System.MainHeader.Component {

    /**
     * Componente principal do módulo.
     */
    export class Main extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Nome da classe CSS deste componente.
         */
        public className: string = 'MainHeader';

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} {
                height: 160px;
            }
            ${this.selector()} > div {
                text-align: center;
                background-image: url(https://dsv.luckygames.tips/media/header-background.png);
                background-size: 150%;
                background-repeat: no-repeat;
                background-position: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                height: 105px;
            }
            ${this.selector()} > div > div {
                background-image: url(https://dsv.luckygames.tips/media/r2d2.png);
                background-size: 200px;
                background-repeat: no-repeat;
                background-position: 0 0;
                height: 180px;
            }
            ${this.selector()} h1,
            ${this.selector()} h2,
            ${this.selector()} h3 {
                margin: 0 0 0 115px;
                padding-top: 9px;
                white-space: nowrap;
            }
            ${this.selector()} h1 {
                color: ${Util.Drawing.blend(-0.4, this.theme.generalTextColor)};                
                font-family: fast-forward;
                font-size: 120%;
            }
            ${this.selector()} h2 {
                color: ${Util.Drawing.blend(0.2, this.theme.generalTextColor)};                
                font-family: ${this.theme.dialogTextFont};
                font-size: 120%;
            }
            ${this.selector()} h3 {
                color: ${Util.Drawing.blend(0.6, this.theme.generalTextColor)};
                font-family: ${this.theme.dialogTextFont};
                font-size: 90%;
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
            const id = Util.String.random();
            return (
                <div id={id} className={this.className}>
                    <div>
                        <div>
                            <h1>{this.theme.title.toUpperCase().replaceAll(" ", ".")}</h1>
                            <h2>{this.translate("Uma maneira de fazer muito mais.")}</h2>
                            <h3>{this.translate("Obrigado pelo apoio.")}</h3>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

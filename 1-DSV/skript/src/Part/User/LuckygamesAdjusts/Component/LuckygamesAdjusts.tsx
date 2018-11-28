namespace Skript.Part.User.LuckygamesAdjusts.Component {

    /**
     * Componente principal do módulo.
     */
    export class LuckygamesAdjusts extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);            
            this.title = this.translate("Luckygames Adjusts");
        }
        
        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {         
            return (
                <div id={this.id()} className={this.className}>
                    <Layout.ReactJs.Component.Switch checked={false} />
                    <Layout.ReactJs.Component.Switch checked={true} />
                    LuckygamesAdjusts<br/>
                    WebSocket: on|off|delay<br/>
                    Animation: on|off<br/>
                    Sounds: on|off<br/>
                    Counts: on|off<br/>
                    <Layout.ReactJs.Component.LanguageSelect />
                    <Layout.ReactJs.Component.LanguageSelect />
                </div>
            );
        }
    }
}

namespace Skript.Part.User.LuckygamesAdjusts.Component {

    /**
     * Componente principal do módulo.
     */
    export class Main extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Nome da classe CSS deste componente.
         */
        public className: string = 'LuckygamesAdjusts';

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} {
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
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
                <div id={this.id()} className={this.className}>
                    LuckygamesAdjusts
                </div>
            );
        }
    }
}

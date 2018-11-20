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
            const id = Util.String.random();
            return (
                <div id={id} className={this.className}>
                    MainHeader
                </div>
            );
        }
    }
}

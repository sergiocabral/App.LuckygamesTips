namespace Skript.Part.System.LogViewer.Component {

    /**
     * Lista os levels de log para seleção
     */
    export class LogLevels extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {
        
        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
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
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                    Levels Log<br />
                </div>
            );
        }
    }
}

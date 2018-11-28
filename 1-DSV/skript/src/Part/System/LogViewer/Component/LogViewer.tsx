namespace Skript.Part.System.LogViewer.Component {

    /**
     * Componente principal do módulo.
     */
    export class LogViewer extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {
        
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

            this.title = this.translate("Log Viwer");
            this.icon = "far fa-list-alt";
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <div>
                    LogViewer <br />
                    LogViewer <br />
                    LogViewer <br />
                    LogViewer <br />
                    LogViewer <br />
                    LogViewer <br />
                    LogViewer <br />
                    LogViewer <br />
                </div>
            );
        }
    }
}

namespace Skript.Part.System.LogViewer.Component {

    /**
     * Componente principal do módulo.
     */
    export class LogViewer extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
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
                <div id={this.id()} className={this.className}>
                    <Layout.ReactJs.Component.Container 
                        title={this.translate("Log Viewer")} 
                        icon="fa-clipboard-list"
                        collapse={true} 
                        newWindow={true}>

                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        
                    </Layout.ReactJs.Component.Container>       
                    <Layout.ReactJs.Component.Container 
                        title={this.translate("Log Viewer")} 
                        collapse={true} 
                        newWindow={true}>

                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        LogViewer <br />
                        
                    </Layout.ReactJs.Component.Container>                
                </div>
            );
        }
    }
}

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
                background-color: green;
            }
            ${this.selectorInDialog()} {
                background-color: red;
            }            
            ${this.selectorOutDialog()} {
                background-color: blue;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);

            this.title = this.translate("Log Viewer");
            this.icon = "far fa-list-alt";
        }

        /**
         * Nova mensagem de log recebida.
         * @param {Core.Log.Message} message Mensagem
         */
        post(message: Core.Log.Message): void {
            message;
        }

        /**
         * Limpar a lista de log.
         */
        public clear() {
            return;
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    <div>Teste</div>
                </div>
            );
        }
    }
}

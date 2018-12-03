namespace Skript.Part.System.MainHeader {

    /**
     * Componente principal do módulo.
     */
    export class Parameters extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

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
            
            this.title = this.translate("Parameters to initialization");
            this.icon = "fas fa-users-cog";
        }
        
        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    Parameters    
                </div>
            );
        }
    }

    new Part("Parameters", Parameters);
}

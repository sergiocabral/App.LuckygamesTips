namespace Layout.Component {

    /**
     * Tipo para props do React deste componente.
     */
    type Props = {

        /**
         * Tema de cores para configurar o layout.
         */
        colors: Layout.Theme.Colors
    }

    /**
     * Tipo para states do React deste componente.
     */
    type State = {
        dialogs: string[]
    }

    /**
     * Janela base que contem outros componentes.
     */
    export class Master extends React.Component<Props, Partial<State>> {

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);
            this.state = { dialogs: [] };
            window.addEventListener('onCreateDialogDemand', this.onCreateDialogDemand);
        }
        
        /**
         * Demanda: Criar nova janela de dialogo.
         */
        private onCreateDialogDemand(evt: any): void {
            const demand = evt.detail as Events.Demand.CreateDialogDemand;
            console.log(this);
            this.setState({ dialogs: this.state && this.state.dialogs ? this.state.dialogs.concat([demand.title]) : [demand.title] });
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const id = Util.String.random();
            const className = "master";

            const jsx = (
                <div id={id} className={className}>
                    {!this.state || !this.state.dialogs ? "" : this.state.dialogs.map(text => (
                        <Layout.Component.Dialog title={text} colors={this.props.colors}></Layout.Component.Dialog>
                    ))}
                </div>
            );

            return jsx;
        }        
    }
}

namespace Layout.Component {

    /**
     * Tipo para props do React deste componente.
     */
    type Props = {
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
        }
        
        /**
         * Commando: Criar nova janela de dialogo.
         */
        public commandCreateDialog(command: Layout.Command.CreateDialog): Layout.Command.CreateDialog {
            this.setState({ dialogs: (this.state.dialogs as string[]).concat([command.title]) });
            return command;
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
                    {(this.state.dialogs as string[]).map(text => (
                        <Layout.Component.Dialog key={Util.String.random()} title={text}></Layout.Component.Dialog>
                    ))}
                </div>
            );

            return jsx;
        }        
    }
}

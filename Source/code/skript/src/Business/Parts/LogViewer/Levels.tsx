namespace Skript.Business.Parts.LogViewer {

    /**
     * Componente: Lista de npiveis de log.
     */
    export class Levels extends Base<LevelsProps, LevelsState> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} > .switch {
                    white-space: nowrap;
                    font-size: 90%;
                }
                ${this.classNameSelector()} > .spacing {
                    border-bottom: 1px solid gainsboro;
                    margin-top: -8px;
                    padding-bottom: ${this.theme.spacing / 2}px;
                    margin-bottom: ${this.theme.spacing / 2}px;
                }
            `;
        }

        /**
         * Construtor.
         * @param {LevelsProps} props Propriedades.
         */
        public constructor(props: LevelsProps) {
            super(props);

            const levels: Framework.Types.IndexValue<string, boolean> = { };
            Object
                .values(Framework.Log.Level)
                .filter(v => typeof(v) === "number" && v <= (!this.theme.debug ? Framework.Log.Level.Debug : Framework.Log.Level.Verbose))
                .forEach(v => levels[v] = { value: Framework.Log.Level[v], state: v < Framework.Log.Level.Verbose });
            this.state = { levels: levels };

            this.onChange = this.onChange.bind(this);
        }

        /**
         * Evento ao marcar o nível de log.
         * @param {string} value Valor selecionador.
         * @param {boolean} checked Marcado ou não.
         * @param {any} evt Informações do evento.
         * @returns {boolean} Um retorno ===false desfaz a alteração.
         */
        private onChange(value: string, checked: boolean): boolean | void {
            const levels = this.state.levels;
            if (value !== "") levels[value].state = checked;
            else Object.keys(this.state.levels).forEach(v => this.state.levels[v].state = checked);
            this.setState({ levels: levels });
            this.callParentOnChange();
        }

        /**
         * Chama o evento onChange do componenete pai.
         */
        private callParentOnChange(): void {
            if (this.props.onChange instanceof Function)
                this.props.onChange(
                    Object.keys(this.state.levels).filter(v => this.state.levels[v].state).map(v => v as any as Framework.Log.Level),
                    Object.keys(this.state.levels).filter(v => !this.state.levels[v].state).map(v => v as any as Framework.Log.Level));
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    {Object.keys(this.state.levels).map(v =>
                        <Framework.Layout.Components.Switch.Switch
                            className="switch"
                            key={v}
                            value={v}
                            checked={this.state.levels[v].state}
                            onChange={this.onChange}>
                            {this.state.levels[v].value.translate()}
                        </Framework.Layout.Components.Switch.Switch>
                    )}
                    <div className="spacing"></div>
                    <Framework.Layout.Components.Switch.Switch
                        className="switch"
                        checked={true}
                        onChange={this.onChange}>
                        {"All".translate()}
                    </Framework.Layout.Components.Switch.Switch>
                </div>
            );
        }

        /**
         * Componente montado.
         */
        public componentDidMount(): void { super.componentDidMount();
            setTimeout(() => this.callParentOnChange(), 0);
        }
    }
}

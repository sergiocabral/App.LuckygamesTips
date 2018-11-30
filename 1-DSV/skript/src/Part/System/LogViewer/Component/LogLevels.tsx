namespace Skript.Part.System.LogViewer.Component {

    /**
     * Core.Log.Level enriquecido.
     */
    class LevelWrapper {

        /**
         * Retorna a lista de níveis de log completa.
         * @param {(id: string) => string} translate Função de tradução.
         * @param {boolean} includeDebug Inclui níveis de log de debug.
         */
        public static mount(translate: (id: string) => string, includeDebug: boolean): LevelWrapper[] {
            const levels: LevelWrapper[] = [];

            Object
                .values(Core.Log.Level)
                .filter(v => typeof(v) === "number" && (includeDebug || Core.Log.Level[v] === "Debug" || Core.Log.Level[v].indexOf("Debug") < 0))
                .map(v => levels.push(new LevelWrapper(v as Core.Log.Level, translate)));

            return levels;
        }

        /**
         * Construtor.
         * @param {Core.Log.Level} level Nível de log.
         * @param {(id: string) => string} translate Função de tradução.
         */
        public constructor(level: Core.Log.Level, translate: (id: string) => string) {
            this.level = level;
            this.name = translate(Core.Log.Level[level]);
            this.checked = true;
        }

        /**
         * Nível do log.
         * @type {Core.Log.Level}
         */
        level: Core.Log.Level;

        /**
         * Nível do log.
         * @type {Core.Log.Level}
         */
        name: string;

        /**
         * Determina se está marcado pelo usuário.
         */
        checked: boolean;
    }

    /**
     * Props para este componente.
     */
    class LogLevelsProps extends Layout.ReactJs.EmptyProps {

        /**
         * Ao trocar a seleção.
         * @param {Core.Log.Level} level Valor acionado.
         * @param {boolean} checked Novo estado do valor acionado.
         * @param {Core.Log.Level[]} checkeds Valores atualmente selecionados.
         * @param {Core.Log.Level[]} uncheckeds Valores atualmente não selecionados.
         */
        onChange?: (level: Core.Log.Level, checked: boolean, checkeds: Core.Log.Level[], uncheckeds: Core.Log.Level[]) => void
    }

    /**
     * Lista os levels de log para seleção
     */
    export class LogLevels extends Layout.ReactJs.ComponentBase<LogLevelsProps, Partial<Layout.ReactJs.EmptyState>> {
        
        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
            }
            ${this.selector()} > .switch {
                white-space: nowrap;
                font-size: 90%;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);
            
            this.onChange = this.onChange.bind(this);

            this.levels = LevelWrapper.mount(this.translate, this.debug());
        }

        /**
         * Lista de níveis de log.
         * @type {LevelWrapper[]}
         */
        private levels: LevelWrapper[];

        /**
         * Evento ao marcar o nível de log.
         * @param {any} evt Informações do evento.
         * @param {string} value Valor selecionador.
         * @param {boolean} checked Marcado ou não.
         */
        private onChange(evt: any, value: string, checked: boolean) {
            evt;
            const level = Number(value) as Core.Log.Level;
            for (let i = 0; i < this.levels.length; i++) {
                if (this.levels[i].level == level) {
                    this.levels[i].checked = checked;
                    break;
                }
            }
            if (this.props.onChange instanceof Function) 
                this.props.onChange(
                    level, 
                    checked,
                    this.levels.filter(v => v.checked).map(v => v.level),
                    this.levels.filter(v => v.checked).map(v => v.level));
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    {this.levels.map(v => 
                        <Layout.ReactJs.Component.Switch className="switch" key={v.level} value={v.level} checked={v.checked} onChange={this.onChange}>{v.name}</Layout.ReactJs.Component.Switch>
                    )}
                </div>
            );
        }
    }
}

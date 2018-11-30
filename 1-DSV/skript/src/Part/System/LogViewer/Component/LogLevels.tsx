namespace Skript.Part.System.LogViewer.Component {

    /**
     * Core.Log.Level enriquecido.
     */
    class LevelWrapper {

        /**
         * Retorna a lista de níveis de log completa.
         * @param {boolean} includeDebug Inclui níveis de log de debug.
         */
        public static mount(includeDebug: boolean): LevelWrapper[] {
            const levels: LevelWrapper[] = [];

            Object
                .values(Core.Log.Level)
                .filter(v => typeof(v) === "number" && (includeDebug || Core.Log.Level[v].indexOf("Debug") < 0))
                .map(v => levels.push(new LevelWrapper(v as Core.Log.Level)));

            return levels;
        }

        /**
         * Construtor.
         * @param {Core.Log.Level} level Nível de log.
         */
        public constructor(level: Core.Log.Level) {
            this.level = level;
            this.name = Core.Log.Level[level];
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
     * State para este componente.
     */
    type LogLevelsState = {

        /**
         * Lista de níveis de log.
         */
        levels: LevelWrapper[]
    }

    /**
     * Lista os levels de log para seleção
     */
    export class LogLevels extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<LogLevelsState>> {
        
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
            this.state = { levels: LevelWrapper.mount(this.debug()) };
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    {(this.state.levels ? this.state.levels : []).map(v => 
                        <Layout.ReactJs.Component.Switch className="switch" key={v.level} value={v.level} checked={v.checked}>{v.name}</Layout.ReactJs.Component.Switch>
                    )}
                </div>
            );
        }
    }
}

namespace Skript.Part.System.LogViewer {

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
         * @param {Core.Log.Level[]} checkeds Valores atualmente selecionados.
         * @param {Core.Log.Level[]} uncheckeds Valores atualmente não selecionados.
         */
        onChange?: (checkeds: Core.Log.Level[], uncheckeds: Core.Log.Level[]) => void
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
            
            this.elContainer = React.createRef();

            this.onChange = this.onChange.bind(this);

            this.levelsList = LevelWrapper.mount(this.translate, this.debug());
        }
        
        /**
         * Referência ao container pai de todos.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContainer: React.RefObject<HTMLDivElement>;

        /**
         * Lista de níveis de log.
         * @type {LevelWrapper[]}
         */
        private levelsList: LevelWrapper[];

        /**
         * REtorna e/ou define os niveis de log selecionados.
         * @param checkeds Opcional. Opções para marcar.
         * @returns {Core.Log.Level[]} Niveis atualmente marcados.
         */
        public levels(checkeds?: Core.Log.Level[]): Core.Log.Level[] {
            const result: Core.Log.Level[] = [];

            if (checkeds !== undefined) {
                for (let i = 0; i < this.levelsList.length; i++) 
                    this.levelsList[i].checked = checkeds.indexOf(this.levelsList[i].level) >= 0;
                if (this.elContainer.current) this.forceUpdate();
                this.callParentOnChange();
            } else {
                for (let i = 0; i < this.levelsList.length; i++) 
                    if (this.levelsList[i].checked)
                        result.push(this.levelsList[i].level);
            }

            return result;
        }

        /**
         * Evento ao marcar o nível de log.
         * @param {any} evt Informações do evento.
         * @param {string} value Valor selecionador.
         * @param {boolean} checked Marcado ou não.
         */
        private onChange(evt: any, value: string, checked: boolean) {
            evt;
            const level = Number(value) as Core.Log.Level;
            for (let i = 0; i < this.levelsList.length; i++) {
                if (this.levelsList[i].level == level) {
                    this.levelsList[i].checked = checked;
                    break;
                }
            }
            this.callParentOnChange();
        }

        /**
         * Chama o evento onChange do componenete pai.
         */
        private callParentOnChange(): void {
            if (this.props.onChange instanceof Function) 
                this.props.onChange(
                    this.levelsList.filter(v => v.checked).map(v => v.level),
                    this.levelsList.filter(v => !v.checked).map(v => v.level));
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()} ref={this.elContainer}>
                    {this.levelsList.map(v => 
                        <Layout.ReactJs.Component.Switch className="switch" key={v.level} value={v.level} checked={v.checked} onChange={this.onChange}>{v.name}</Layout.ReactJs.Component.Switch>
                    )}
                </div>
            );
        }
    }
}

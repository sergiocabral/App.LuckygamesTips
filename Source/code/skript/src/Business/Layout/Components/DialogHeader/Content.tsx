namespace Skript.Business.Layout.Components.DialogHeader {

    export abstract class Content<
        TProps extends Framework.Layout.Components.EmptyProps =
            Framework.Layout.Components.EmptyProps,
        TState extends Framework.Layout.Components.EmptyState =
            Framework.Layout.Components.EmptyState>
        extends Framework.Layout.Components.DialogHeader.Content<TProps, TState> {

        /**
         * Construtor.
         * @param {TProps} props Propriedades.
         */
        public constructor(props: TProps) {
            super(props);
            this.log = Core.Main.instance.log;
            this.theme = Core.Main.instance.theme;
            this.toast = Core.Main.instance.activator && Core.Main.instance.activator.toast ? Core.Main.instance.activator.toast : undefined as any;

            this.automation = { parameters: { }, actions: { } };
            const automationName = this.configureAutomation(this.automation.parameters, this.automation.actions);
            Core.Main.instance.automation.add(automationName, this.automation);
        }

        /**
         * Agrupa ações sobre o visual css do sistema.
         * @type {Theme}
         */
        public theme: Theme;

        /**
         * Exibidor de mensagem tipo toast.
         * @type {Toast.Toast}
         */
        public toast: Toast.Toast;

        /**
         * Histórico de log.
         * @type {Framework.Log.History}
         */
        public log: Framework.Log.History;

        /**
         * Adiciona ações e parâmetros para automação deste componente.
         * @param {Framework.Types.Index<Framework.Types.Parameter<any>>} parameters Parâmetros.
         * @param {Framework.Types.Index<Framework.Types.Action>} actions Ações.
         * @returns {string} Nome do módulo.
         */
        protected abstract configureAutomation(parameters: Framework.Types.Index<Framework.Types.Parameter<any>>, actions: Framework.Types.Index<Framework.Types.Action>): string;

        /**
         * Ações e parâmetros para automação deste componente.
         * @type {Automation.Set}
         */
        public automation: Automation.Set;
    }
}
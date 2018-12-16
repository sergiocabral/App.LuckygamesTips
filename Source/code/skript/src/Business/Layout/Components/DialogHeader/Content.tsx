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
            this.theme = Core.Main.instance.theme;

            this.automation = {
                parameters: { },
                actions: { }
            }
            this.configureAutomation(this.automation.parameters, this.automation.actions);
        }

        /**
         * Agrupa ações sobre o visual css do sistema.
         * @type {Theme}
         */
        public theme: Theme;

        /**
         * Adiciona ações e parâmetros para automação deste componente.
         */
        protected abstract configureAutomation(parameters: Framework.Types.Index<Framework.Types.Parameter<any>>, actions: Framework.Types.Index<Framework.Types.Action>): void;

        /**
         * Ações e parâmetros para automação deste componente.
         */
        public automation: { 

            /**
             * Lista para definir/ler os parâmetros da tela.
             * @type {Framework.Types.Index<Framework.Types.Parameter<any>>}
             */
            parameters: Framework.Types.Index<Framework.Types.Parameter<any>>,

            /**
             * Lista para execução de ações.
             * @type {Framework.Types.Index<Framework.Types.Action>}
             */
            actions: Framework.Types.Index<Framework.Types.Action>
        }
    }
}
namespace Skript.Business.Layout.Components {

    export abstract class Base<
        TProps extends Framework.Layout.Components.EmptyProps = 
            Framework.Layout.Components.EmptyProps, 
        TState extends Framework.Layout.Components.EmptyState = 
            Framework.Layout.Components.EmptyState>
        extends Framework.Layout.Components.Base<TProps, TState> {

        /**
         * Timeout para sinalizar que os módulos já foram carregados.
         * @type {NodeJS.Timeout}
         */
        private static partsLoadedTimeout: NodeJS.Timeout = undefined as any;

        /**
         * Sinaliza que os módulso já foram carregados.
         * @type {boolean}
         */
        private static partsLoaded: boolean = false;

        /**
         * Construtor.
         * @param {TProps} props Propriedades.
         */
        public constructor(props: TProps) { 
            super(props);
            this.log = Core.Main.instance.log;
            this.theme = Core.Main.instance.theme;
            this.toast = Core.Main.instance.activator && Core.Main.instance.activator.toast ? Core.Main.instance.activator.toast : undefined as any;

            if (!Base.partsLoaded) {
                clearTimeout(Base.partsLoadedTimeout);
                Base.partsLoadedTimeout = setTimeout(() => { Base.partsLoaded = true; new Messages.DidPartsLoaded().send(); }, 1000);
            }
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
    }
}
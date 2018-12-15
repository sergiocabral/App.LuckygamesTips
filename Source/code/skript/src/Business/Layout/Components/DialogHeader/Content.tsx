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
        }

        /**
         * Agrupa ações sobre o visual css do sistema.
         * @type {Theme}
         */
        public theme: Theme;
    }
}
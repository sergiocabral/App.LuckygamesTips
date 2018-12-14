namespace Skript.Business.Parts {

    export abstract class Base<
        TProps extends Framework.Layout.Components.EmptyProps = 
            Framework.Layout.Components.EmptyProps, 
        TState extends Framework.Layout.Components.EmptyState = 
            Framework.Layout.Components.EmptyState>
        extends Layout.Components.Base<TProps, TState> {

        /**
         * Construtor.
         * @param {TProps} props Propriedades.
         */
        public constructor(props: TProps) { 
            super(props);
        }

        /**
         * Lista de componentes para adicionar na janela principal.
         * @type {any[]}
         */
        public static toAppendToMainDialog: any[] = [];

        /**
         * Evento ao adicionar elementos na janela principal.
         */
        public static appendToMainDialog(): void {
            while (Base.toAppendToMainDialog.length) 
                new Messages.DoAppendToMainDialog(
                    React.createElement(Base.toAppendToMainDialog.shift(), undefined, undefined))
                        .send();
        }
    }

    Framework.Bus.Message.capture(Messages.DidMainDialogLoaded, undefined, Base.appendToMainDialog);
}
namespace Skript.Layout.ReactJs {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Tipo para props vazio do React deste componente.
     */
    export type EmptyProps = { }

    /**
     * Tipo para state vazio do React deste componente.
     */
    export type EmptyState = { }

    /**
     * Botão que ativa o sistema.
     */
    export abstract class ComponentBase<P, S> extends React.Component<P, S> {

        /**
         * Nome da classe CSS deste componente.
         */
        public abstract className: string;

        /**
         * Código CSS para este componente.
         */
        public abstract stylesheet: string;
        
        /**
         * Construtor.
         * @param {P} props Propriedades.
         */
        public constructor(props: P) {
            super(props);
            setTimeout(() => this.loadStylesheet(), 1);
        }

        /**
         * Registra o código CSS para este componente.
         */
        protected loadStylesheet(): void {
            if (typeof(this.stylesheet) === "string" && this.stylesheet) {
                Util.DOM.stylesheetCode(this.stylesheet);
            }
        }

        /**
         * Tema de cores para configurar o layout
         */
        protected theme: Theme.Stylesheet = new Theme.Stylesheet(skript.data.colors);

        /**
         * Seletor CSS mais alto que engloba o componente.
         */
        protected selector: Function = () => `.${Presentation.className} .${this.className}`;
    }
}

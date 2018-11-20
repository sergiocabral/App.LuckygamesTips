namespace Skript.Layout.Message {

    /**
     * Adiciona um componente a janela de diálogo principal.
     */
    export class AppendPartInMainDialog extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {React.Component} component Componente.
         */
        public constructor(component: React.Component) {
            super();
            this.component = component;
        }

        /**
         * Componente.
         * @type {PartBase}
         */
        public component: React.Component;
    }
}
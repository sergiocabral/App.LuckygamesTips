namespace Skript.Layout.Message {

    /**
     * Adiciona um componente a janela de diálogo principal.
     */
    export class AppendToMainDialog extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {React.ReactNode} children Conteúdo.
         */
        public constructor(children: React.ReactNode) {
            super();
            this.children = children;
        }

        /**
         * Componente.
         * @type {PartBase}
         */
        public children: React.ReactNode;
    }
}
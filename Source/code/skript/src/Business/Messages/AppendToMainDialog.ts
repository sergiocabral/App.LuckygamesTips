namespace Skript.Business.Messages {

    /**
     * Adiciona elementos na janela de diálogo principal.
     */
    export class AppendToMainDialog extends Framework.Bus.Message {

        /**
         * Construtor.
         * @param part Módulo.
         */
        public constructor(public part: React.ReactNode) {
            super();
        }
    }
}
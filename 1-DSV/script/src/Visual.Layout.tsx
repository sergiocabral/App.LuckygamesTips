namespace Visual {

    /**
     * Organiza e manipula o layout.
     */
    export class Layout {

        /**
         * Traduções.
         */
        private static translates: Core.Translates = new Core.Translates(
            [
                {
                    key: "A função Layout.initialize() não foi chamada.",
                    translates: [
                        { language: "en", text: "The Layout.initialize() function was not called." }
                    ]
                }            
            ]
        );

        /**
         * Nome da class CSS que contem todo o layout.
         */
        public static className: string = 'luckygamestips';
        
        /**
         * Indica se o layout já foi inicializado.
         */
        private static isInitialized: boolean = false;

        /**
         * Elemento HTML que contém todos os itens do layout
         */
        private static containerElement: Element|undefined = undefined;

        /**
         * Prepara o ambiente da página
         * @returns void
         */
        public static initialize(): void {
            if (Layout.isInitialized) return;

            const div: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            div.id = "_" + btoa(String(Math.random())).substr(5, 5);
            div.className = Layout.className;

            Core.Messages.log(`HTMLElement container <${div.tagName.toLowerCase()} id="${div.id} />".`, Core.LogLevel.Debug);

            document.body.appendChild(div);

            Layout.containerElement = div;
            Layout.isInitialized = true;                
        }

        /**
         * Cria um janela de diálogo.
         * @param title Título
         */
        public static createDialog(title: string): void {

            if (!Layout.isInitialized) {
                throw new Error(Layout.translates.get('A função Layout.initialize() não foi chamada.'));
            }

            ReactDOM.render(
                React.createElement(Component.Dialog, { title: title }, null),
                Layout.containerElement as Element);
        }
    }
}
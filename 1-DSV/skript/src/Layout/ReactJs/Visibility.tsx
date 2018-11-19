namespace Skript.Layout.ReactJs {

    /**
     * Implementa a exibição/esconder suave do elemento.
     */
    export class Visibility {

        /**
         * Construtor.
         * @param {HTMLElement} owner Elemento.
         * @param {boolean} show Opcional. Indica se o elemento deve começar visível.
         * @param {number} fade Opcional. Tempo em segundo da transição.
         */
        public constructor(element: HTMLElement, show: boolean = false, fade: number = 0.2) {
            this.element = element;
            
            this.stylesheet();

            this.seconds = 0;
            this.fade(fade);

            element.style.visibility = "hidden";
            element.classList.add("visibility");
            this.visible(false);
            if (show) setTimeout(() => this.visible(show), 1);
        }

        /**
         * Elemento.
         * @type {HTMLElement}
         */
        public element: HTMLElement;

        /**
         * Tempo da transição.
         */
        private seconds: number;

        /**
         * Define o tempo da transição.
         * @param {number} seconds Opcional. Tempo em segundos
         * @returns {number} Valor atual.
         */
        public fade(seconds?: number): number {
            if (seconds !== undefined) {
                this.seconds = seconds;
                this.element.style.transition = `opacity ${seconds.toFixed(1)}s ease-out`;
            }
            return this.seconds;
        }

        /**
         * Registra o código CSS.
         */
        private stylesheet() {
            const selector = `.${Presentation.className}`;
            Util.DOM.stylesheetCode(`
            ${selector} .visibility {
                visibility: visible !important;
                opacity: 1;
            }
            ${selector} .visibility.hidden {
                opacity: 0;
            }
            `);
        }

        /**
         * Define a exibição do elemento.
         * Quando nenhum parâmetro é informado apenas retorna a informação.
         * @param {boolean} mode Opcional. Exibe ou esconde.
         * @returns {boolean} Retorna o estado de exibição.
         */
        public visible(mode?: boolean): boolean {
            if (mode === true) {
                this.element.classList.remove("hidden");
            } else if (mode === false) {
                this.element.classList.add("hidden");
            }
            return !this.element.classList.contains("hidden");
        }
    }
}

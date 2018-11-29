namespace Skript.Layout.ReactJs {

    /**
     * Configuração de inicialização.
     */
    export type VisibilityConfiguration = {

        /**
         * Elemento.
         * @type {HTMLElement}
         */
        element: HTMLElement,
        
         /**
          * Indica se o elemento deve começar visível.
          * @type {boolean}
          */
        show?: boolean,

        /**
         * Tempo em segundo da transição.
         * @type {number}
         */
        fade?: number,

        /**
         * Opacidade quando o elemento está invisível.
         */
        opacityHidden?: number,

        /**
         * Opacidade quando o elemento está visível.
         */
        opacityVisible?: number,

        /**
         * Opacidade quando o elemento está com o mouse sobre.
         */
        opacityHover?: number,
    }

    /**
     * Implementa a exibição/esconder suave do elemento.
     */
    export class Visibility {

        /**
         * Construtor.
         * @param {VisibilityConfiguration} configuration Configuração de inicialização.
         */
        public constructor(configuration: VisibilityConfiguration) {
            this.configuration = configuration;

            configuration.show = configuration.show !== undefined ? configuration.show : false;
            configuration.fade = configuration.fade !== undefined ? configuration.fade : 0.2;
            
            this.configuration.opacityHidden = this.configuration.opacityHidden !== undefined ? this.configuration.opacityHidden : 0;
            this.configuration.opacityVisible = this.configuration.opacityVisible !== undefined ? this.configuration.opacityVisible : 1;
            this.configuration.opacityHover = this.configuration.opacityHover !== undefined ? this.configuration.opacityHover : 1;

            this.className = Util.String.random();
            configuration.element.classList.add(this.className);
            this.stylesheet();

            this.fade(configuration.fade);

            configuration.element.style.display = "none";
            configuration.element.classList.add("visibility");
            configuration.element.classList.add("hidden");
            if (configuration.show) setTimeout(() => this.visible(true), 1);
        }

        /**
         * Configuração de inicialização.
         * @type {VisibilityConfiguration}
         */
        public configuration: VisibilityConfiguration;

        /**
         * Classe name atribuida ao elemento para aplicação de css de transição.
         */
        public className: string;

        /**
         * Define o tempo da transição.
         * @param {number} seconds Opcional. Tempo em segundos
         * @returns {number} Valor atual.
         */
        public fade(seconds?: number): number {
            if (seconds !== undefined) {
                this.configuration.fade = seconds;
                this.configuration.element.style.transition = `opacity ${seconds.toFixed(1)}s ease-out`;
            }            
            return this.configuration.fade as number;
        }

        /**
         * Registra o código CSS.
         */
        private stylesheet() {
            const selector = `.${Presentation.className} .${this.className}`;
            Util.DOM.stylesheetCode(`
            ${selector}.visibility {
                visibility: visible !important;
                opacity: ${(this.configuration.opacityVisible as number).toFixed(2)};
            }
            ${selector}.visibility.hidden {
                opacity: ${(this.configuration.opacityHidden as number).toFixed(2)};
            }
            ${selector}.visibility:not(.hiding):hover {
                opacity: ${(this.configuration.opacityHover as number).toFixed(2)};
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
                this.configuration.element.style.display = "";
                setTimeout(() => this.configuration.element.classList.remove("hidden"), 10);
            } else if (mode === false) {
                this.configuration.element.classList.add("hiding");                
                this.configuration.element.classList.add("hidden");
                setTimeout(() => {
                    if (!this.visible()) {
                        this.configuration.element.style.display = "none";
                        this.configuration.element.classList.remove("hiding");
                    }
                }, (this.configuration.fade as number) * 1000);
            }
            
            return !this.configuration.element.classList.contains("hidden");
        }
    }
}

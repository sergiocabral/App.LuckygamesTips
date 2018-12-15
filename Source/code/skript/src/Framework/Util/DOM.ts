namespace Skript.Framework.Util {

    /**
     * Utilitários para manipulação do DOM.
     */
    export class DOM {

        /**
         * Carrega um código CSS dinamicamente.
         * Carregamentos repetidos são evitados com verificação de hash.
         * @param {string} css Código CSS.
         * @param {boolean} minify Minifica o código.
         */
        public static stylesheet(css: string, minify: boolean = true): void {
            if (typeof(css) !== "string" || !css.length) return;

            if (minify) css = css.trimAll();

            const hash = css.hash().toString().random();
            const id = `style-${hash}`;

            if (document.getElementById(id)) return;

            const element: HTMLStyleElement = document.createElement("style") as HTMLStyleElement;
            element.id = id;
            element.innerHTML = css;
            document.body.prepend(element);

            console.Log("Inserted: <{tagName} id=\"{id}\" />", element, "Util.DOM", element);
        }

        /**
         * Monta a lista de elementos ancestrais.
         * @param {Element} element Elemento.
         * @returns {Element[]} Lista. O index 0 é o próprio elemento passado.
         */
        public static path(element: Element): Element[] {
            const elements = [element];
            while (elements[elements.length - 1].parentElement) elements.push(elements[elements.length - 1].parentElement as Element);
            return elements;
        }

        /**
         * Retorna o primeiro ancestral dentro do critério.
         * @param {Element | null} element Elemento.
         * @param {string} tagName Nome da tag.
         * @param {boolean} includeElement Opcional. Quando true inclui o elemento na busca.
         * @returns {Element | null} Elemento encontrado.
         */
        public static parentWithTag(element: Element | null, tagName: string, includeElement: boolean = false): Element | null {
            if (!element) return null;
            if (!includeElement) element = element.parentElement;

            tagName = String(tagName).toUpperCase();

            while (
                element !== null && 
                element.parentElement !== null && 
                element.tagName.toUpperCase() !== tagName) 
                    element = element.parentElement;

            return element;
        }

        /**
         * Retorna o primeiro ancestral dentro do critério.
         * @param {Element | null} element Elemento.
         * @param {string} className Class CSS.
         * @param {boolean} includeElement Opcional. Quando true inclui o elemento na busca.
         * @returns {Element | null} Elemento encontrado.
         */
        public static parentWithClass(element: Element | null, className: string, includeElement: boolean = false): Element | null {
            if (!element) return null;
            if (!includeElement) element = element.parentElement;

            while (
                element !== null && 
                element.parentElement !== null && 
                !element.classList.contains(className))
                    element = element.parentElement;

            return element;
        }

        /**
         * Determina se um elemento está na frente ou atrás de todos os irmãos.
         * @param {HTMLElement} element Elemento
         * @param {Types.BackFront} where Direção
         * @returns {boolean} Quando passa na validação.
         */
        public static isBring(element: HTMLElement, where: Types.BackFront): boolean {
            return !!element.parentElement && (
                (where === Types.BackFront.Back && element.parentElement.children[0] === element) ||
                (where === Types.BackFront.Front && element.parentElement.children[element.parentElement.children.length - 1] === element)
            );
        }

        /**
         * Move um elemento dentro do seu parent.
         * @param {HTMLElement} element Elemento
         * @param {Types.BackFront} to Direção
         * @param {boolean} cssFlag Opcional. Aplica no elemento classes css "bringTo" e ("bringToFront" ou "bringToBack").
         */
        public static bring(element: HTMLElement, to: Types.BackFront, cssFlag: boolean = false): void {
            const logInfo: any = {
                element: element,
                parentElement: element.parentElement,
            }

            if (!element.parentElement) return;

            /**
             * Sinaliza o elemento com flag de class css indicnaod que sofreu bringTo.
             * @param {number} interval Tempo para remoção das classCss para sinalização.
             */
            const cssFlagApply = (interval: number = 1000): void => {
                const classCss = ["bringTo", "bringTo" + Types.BackFront[to]];
                classCss.map(v => element.classList.add(v));
                setTimeout(() => classCss.map(v => element.classList.remove(v)), interval);
            };

            let bringTo = false;
            switch (to) {
                case Types.BackFront.Back:
                    bringTo = element.parentElement.children[0] !== element;
                    if (bringTo) {
                        if (cssFlag) cssFlagApply();
                        setTimeout(() => (element as any).parentElement.prepend(element), 1);
                    }
                    break;
                case Types.BackFront.Front:
                    bringTo = element.parentElement.children[element.parentElement.childNodes.length - 1] !== element;
                    if (bringTo) {
                        if (cssFlag) cssFlagApply();
                        setTimeout(() => (element as any).parentElement.append(element), 1);
                    }
                    break;
                default: throw new Errors.InvalidArgument("BringTo");
            }

            logInfo.children = element.parentElement.children.length;
            logInfo.childrenFirst = element.parentElement.children[0];
            logInfo.childrenLast = element.parentElement.children[element.parentElement.children.length - 1];
            if (bringTo) console.Log('Applied BringTo {direction}: <{tagName} id="{id}" />', { tagName: element.tagName, id: element.id, direction: Types.BackFront[to] }, "Util.DOM", logInfo);
        }

        /**
         * Limpa a seleção do usuário.
         */
        public static clearSelection(): void {
            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if ((document as any).selection) {  // IE?
                (document as any).selection.empty();
            }
        }
    }
}
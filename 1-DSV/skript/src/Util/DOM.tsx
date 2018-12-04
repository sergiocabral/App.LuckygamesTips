namespace Skript.Util {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Utilitários para manipulação do DOM.
     */
    export class DOM {

        /**
         * Carrega um código CSS dinamicamente.
         * Carregamentos repetidos são evitados com verificação de hash.
         * @param {string} code Código CSS.
         * @param {boolean} minify Minifica o código.
         */
        public static stylesheetCode(code: string, minify: boolean = true): void {
            if (typeof(code) !== "string" || !code.length) return;

            if (minify) while ((code = code.replaceAll("\n", " ").replaceAll("\r", " ").replaceAll("  ", " ")).indexOf("  ") >= 0);
            
            const hash: number = code.hash();
            const id = `style-${hash}`.replace("--", "-");
            
            if (document.getElementById(id)) return;

            const element: HTMLStyleElement = document.createElement("style") as HTMLStyleElement;
            element.id = id;
            element.innerHTML = code;
            document.body.prepend(element);

            skript.log.post('Inserted: <{tagName} id=\"{id}\" />', element, Core.Log.Level.DebugDOM, element);
        }

        /**
         * Monta a lista de elementos ancestrais.
         * @param element Elemento.
         * @returns {Element[]} Lista. O index 0 é o próprio elemento passado.
         */
        public static path(element: Element): Element[] {
            const elements = [element];
            while (elements[elements.length - 1].parentElement) elements.push(elements[elements.length - 1].parentElement as Element);
            return elements;
        }

        /**
         * Determina se um elemento está na frente ou atrás de todos os irmãos.
         * @param {HTMLElement} element Elemento
         * @param {BringTo} where Direção
         * @returns {boolean} Quando passa na validação.
         */
        public static isBring(element: HTMLElement, where: BringTo): boolean {
            return !!element.parentElement && (
                (where === BringTo.Back && element.parentElement.children[0] === element) ||
                (where === BringTo.Front && element.parentElement.children[element.parentElement.children.length - 1] === element)
            );
        }

        /**
         * Move um elemento dentro do seu parent.
         * @param {HTMLElement} element Elemento
         * @param {BringTo} to Direção
         * @param {boolean} cssFlag Opcional. Aplica no elemento classes css "bringTo" e ("bringToFront" ou "bringToBack").
         */
        public static bring(element: HTMLElement, to: BringTo, cssFlag: boolean = false): void {
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
                const classCss = ["bringTo", "bringTo" + BringTo[to]];
                classCss.map(v => element.classList.add(v));
                setTimeout(() => classCss.map(v => element.classList.remove(v)), interval);
            };

            let bringTo = false;
            switch (to) {
                case BringTo.Back:
                    bringTo = element.parentElement.children[0] !== element;
                    if (bringTo) { 
                        if (cssFlag) cssFlagApply();
                        setTimeout(() => (element as any).parentElement.prepend(element), 1);
                    }
                    break;
                case BringTo.Front: 
                    bringTo = element.parentElement.children[element.parentElement.childNodes.length - 1] !== element;
                    if (bringTo) {
                        if (cssFlag) cssFlagApply();
                        setTimeout(() => (element as any).parentElement.append(element), 1);
                    }
                    break;
                default: throw new Core.Errors.InvalidArgument("BringTo");
            }
            
            logInfo.children = element.parentElement.children.length;
            logInfo.childrenFirst = element.parentElement.children[0];
            logInfo.childrenLast = element.parentElement.children[element.parentElement.children.length - 1];
            if (bringTo) skript.log.post('Applied BringTo {direction}: <{tagName} id="{id}" />', { tagName: element.tagName, id: element.id, direction: BringTo[to] }, Core.Log.Level.DebugDOM, logInfo);
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

        /**
         * Class css para janela de prompt ao usuário da função dialog()
         * @type {string}
         */
        private static dialogClassName: string = Text.random();

        /**
         * Exibe uma janela de mensagem ao usuário.
         * @param {string|DialogProps} configuration Texto de exibição ou informações de configuração.
         * @returns {Promise<DialogButton>} Quando a mensagem é fechada retorna o nome do botão acionado.
         */
        public static dialog(info: string|DialogProps): Promise<DialogButton> {
            const containerParent = document.querySelector("." + Layout.Presentation.className);

            if (!containerParent) throw new Core.Errors.EnvironmentNotReady(`document.querySelector(".${Layout.Presentation.className}") is null`);

            const className = DOM.dialogClassName;
            const selector = `.${Layout.Presentation.className} > .${className}`;
            DOM.stylesheetCode(`
                ${selector} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background-color: rgba(0,0,0,0.5);
                    z-index: ${skript.presentation.theme.zIndex * 10};
                }
                ${selector} .prompt {
                    z-index: ${skript.presentation.theme.zIndex * 10 + 1};
                    position: relative;
                    top: 50%;
                    margin: auto;
                    width: 80%;
                    max-width: 400px;
                    transform: translateY(-50%);
                    background-color: white;
                    border-radius: 5px;
                    box-shadow: 0 0 50px rgba(255,255,255,0.25), 0 0 10px black;
                }
                ${selector} .prompt > h1 {
                    color: ${Util.Drawing.blend(0.2, skript.presentation.theme.generalTextColor)};
                    padding: 10px;
                    border-bottom: 1px solid #e0e0e0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                ${selector} .prompt > p {
                    padding: 10px 10px 0 10px;
                    font-size: 18px;
                }
                ${selector} .prompt > div {
                    text-align: right;
                    padding: 10px;
                }
                ${selector} .prompt > div > .button {
                    font-size: 15px;
                    padding: 5px 10px;
                    margin-left: 10px;
                }
                ${selector} .prompt > div > .button > span {
                    margin-left: 5px;
                    font-weight: normal;
                }
            `);            

            return new Promise(resolve => {
                const configuration: DialogProps = typeof(info) !== "string" ? info : { text: info };
                configuration.buttons = configuration.buttons && configuration.buttons.length ? configuration.buttons : [{}];
                configuration.buttons.map(v => {
                    v.name = v.name ? v.name : "";
                    v.icon = v.icon ? v.icon : "far fa-check-circle";
                    v.className = v.className ? v.className : "";
                });
                
                let buttonEscapeIndex = -1;
                
                let html;

                const dialog = document.createElement("DIV") as HTMLDivElement;
                dialog.id = Text.random();
                dialog.className = "prompt";
                html = "";
                if (configuration.title) html += `<h1>${configuration.title}</h1>`;
                if (configuration.text) html += "<p>" + configuration.text.replaceAll("\n", "</p><p>") + "</p>";
                html += "<div>";
                for (let i = 0; i < configuration.buttons.length; i++) {
                    if (buttonEscapeIndex < 0 && configuration.buttons[i].escape) buttonEscapeIndex = i;
                    html += `<button data-index="${i}" class="button${configuration.buttons[i].className ? " " + configuration.buttons[i].className : ""}${configuration.buttons[i].focus ? " focus" : ""}">`;
                    if (configuration.buttons[i].icon) html += `<i class="${configuration.buttons[i].icon}"></i>`;
                    if (configuration.buttons[i].name) html += `<span>${configuration.buttons[i].name}</span>`;
                    if (!configuration.buttons[i].icon && configuration.buttons[i].name) html += `<i class="fas fa-check-circle"></i>`;
                    html += "</button>";
                }
                html += "</div>";
                dialog.innerHTML = html;

                const container = document.createElement("DIV") as HTMLDivElement;
                container.id = Text.random();
                container.className = className;
                container.append(dialog);

                containerParent.append(container);

                setTimeout(() => {
                    let toFocus = document.querySelector(`${selector}#${container.id} button.focus`) as HTMLButtonElement;
                    if (!toFocus) toFocus = document.querySelector(`${selector}#${container.id} button[data-index="0"]`) as HTMLButtonElement;
                    if (toFocus) toFocus.focus();
                }, 1);

                const buttons = document.querySelectorAll(`${selector}#${container.id} button[data-index]`);
                
                /**
                 * Capturar tecla de atalho.
                 * @param {KeyboardEvent} evt Informações sobre o evento.
                 */
                const key = (evt: KeyboardEvent): void => {
                    if (!this.isBring(container, BringTo.Front)) return;
                    if (evt.keyCode === 27) (buttons[buttonEscapeIndex >= 0 ? buttonEscapeIndex : 0] as HTMLButtonElement).click();
                }

                /**
                 * Clique nos botões da janela.
                 * @param {MouseEvent} evt Informações sobre o evento.
                 */
                const click = (evt: MouseEvent): void => {
                    let button = evt.target as HTMLElement;
                    while (!button.hasAttribute("data-index") && button.parentElement) button = button.parentElement;
                    const index = parseInt(button.getAttribute("data-index") as string);
                    container.remove();
                    window.removeEventListener("keyup", key as any);
                    resolve(Number.isFinite(index) && configuration.buttons ? configuration.buttons[index] : undefined);
                };

                for (let i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", click as any);
                if (buttons.length === 1 || buttonEscapeIndex >= 0) window.addEventListener("keyup", key as any);
            });
        }

        /**
         * Solicita confirmação de sim ou não ao usuário.
         * @param {string} text Pergunta.
         * @param {string} title Opcional. Título.
         */
        public static confirm(text: string, title?: string): Promise<void> {
            return new Promise(resolve => {
                DOM.dialog({ 
                    title: title,
                    text: text,
                    buttons: [
                        {
                            name: skript.translate.get("No"),
                            icon: "fas fa-times-circle",
                            escape: true
                        },
                        {
                            name: skript.translate.get("Yes"),
                            icon: "fas fa-check-circle",
                            focus: true,
                            className: "blue"
                        }
                    ]
                }).then((button) => {
                    if (!button.escape) resolve();
                });
            });
        }
   }
}
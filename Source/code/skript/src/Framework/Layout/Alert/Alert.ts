namespace Skript.Framework.Layout.Dialog {

    /**
     * Exibição de janelas de diálogo ao usuário.
     */
    export class Alert {

        /**
         * Class css para componentes gerados nesta classe.
         * @type {string}
         */
        public static className: string = "dialog-alert";

        /**
         * Carrega e aplica os estilos css.
         */
        public static stylesheet(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className} .${Alert.className}`;
            Util.DOM.stylesheet(`
                ${selector} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 991;
                }
                ${selector} .dialog-box {
                    text-align: left;
                    position: relative;
                    top: 50%;
                    margin: auto;
                    width: 80%;
                    max-width: 400px;
                    transform: translateY(-50%);
                    background-color: white;
                    border-radius: 3px;
                    box-shadow: 0 0 50px rgba(255,255,255,0.25), 0 0 10px black;
                }
                ${selector} .dialog-title > h1 {
                    margin: 0;
                    padding: 10px;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                ${selector} .dialog-type:first-child + .dialog-text > *:first-child {
                    margin-top: 16px;
                }
                ${selector} .dialog-text {
                    margin-left: 55px;
                    min-height: 50px;
                    max-height: 100px;
                    overflow: auto;
                }
                ${selector} .dialog-text p {
                    margin: 3px 0 0 0;
                    padding: 0;
                    font-size: 16px;
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.25);
                }
                ${selector} .dialog-text p:last-child {
                    margin-bottom: 3px;
                }
                ${selector} .dialog-type {
                    position: absolute;
                    font-size: 25px;
                    width: 55px;
                    text-align: center;
                    margin-top: 13px;
                }
                ${selector} .dialog-type i {
                    color: rgba(127,127,127,0.5);
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.25);
                    opacity: 0.75;
                }
                ${selector} .dialog-type i.Question {
                    color: rgba(127,255,127,0.5);
                }
                ${selector} .dialog-type i.Information {
                    color: rgba(0,127,255,0.5);
                }
                ${selector} .dialog-type i.Warning {
                    color: rgba(255,127,0,0.5);
                }
                ${selector} .dialog-type i.Error {
                    color: rgba(255,0,0,0.5);
                }
                ${selector} .dialog-prompt {
                    padding: 10px 10px 0 55px;
                }
                ${selector} .dialog-prompt input {
                    width: calc(100% - 14px);
                    padding: 0 5px;
                    border: 1px solid rgba(0,0,0,0.25);
                }
                ${selector} .dialog-prompt input.invalid {
                    background-color: rgba(255,0,0,0.1);
                }
                ${selector} .dialog-text + * {
                    border-top: 1px solid rgba(0,0,0,0.1);
                }
                ${selector} .dialog-buttons {
                    text-align: right;
                    padding: 10px;
                }
                ${selector} .dialog-buttons button {
                    margin: 0 0 0 10px;
                }
                ${selector} .dialog-buttons button > * {
                    margin: 0 3px;
                }
            `);
        }

        /**
         * Monta a estrutura: Título.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {HTMLElement} Elemento HTML.
         */
        private static makeTitle(configuration: Configuration): HTMLElement|undefined {
            if (!configuration.title) return;

            const el = document.createElement("DIV") as HTMLDivElement;
            el.className = "dialog-title";
            el.innerHTML = `<h1>${configuration.title}</h1>`;

            return el;
        }

        /**
         * Monta a estrutura: Tipo.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {HTMLElement} Elemento HTML.
         */
        private static makeType(configuration: Configuration): HTMLElement {
            let icon;
            switch (configuration.type) {
                case Type.Input: icon = "fas fa-keyboard"; break;
                case Type.Question: icon = "fas fa-question-circle"; break;
                case Type.Information: icon = "fas fa-info-circle"; break;
                case Type.Warning: icon = "fas fa-exclamation-triangle"; break;
                case Type.Error: icon = "fas fa-times-circle"; break;
                default: icon = "";
            }

            const el = document.createElement("DIV") as HTMLDivElement;
            el.className = "dialog-type";
            el.innerHTML = icon && configuration.type ? `<i class="${icon} ${Type[configuration.type]}"></i>` : "";
            return el;
        }

        /**
         * Monta a estrutura: Texto.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {HTMLElement} Elemento HTML.
         */
        private static makeText(configuration: Configuration): HTMLElement {
            const el = document.createElement("DIV") as HTMLDivElement;
            el.className = "dialog-text";

            const lines = configuration.text.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const elP = document.createElement("P") as HTMLParagraphElement;
                elP.innerHTML = lines[i];
                el.appendChild(elP);
            }

            return el;
        }

        /**
         * Monta a estrutura: Entrada de dados.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {HTMLElement} Elemento HTML.
         */
        private static makePrompt(configuration: Configuration): HTMLElement|void {
            if (!configuration.input) return;

            const elInput = document.createElement("INPUT") as HTMLInputElement;
            elInput.value = configuration.input.defaults ? configuration.input.defaults : "";

            const el = document.createElement("DIV") as HTMLDivElement;
            el.className = "dialog-prompt";
            el.appendChild(elInput);

            return el;
        }

        /**
         * Monta a estrutura: Botões.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {HTMLElement} Elemento HTML.
         */
        private static makeButtons(configuration: Configuration): HTMLElement {
            const el = document.createElement("DIV") as HTMLDivElement;
            el.className = "dialog-buttons";

            let html = "";
            for (let i = 0; i < configuration.buttons.length; i++) {
                const button = configuration.buttons[i];

                let className = "";
                if (button.className) className += ` ${button.className}`;
                if (button.focus) className += ` button-focus`;
                if (button.escape) className += ` button-escape`;
                if (className) className = ` class="${className.trim()}"`;

                html += `<button${className} data-index="${i}">`;
                if (button.icon) html += `<i class="${button.icon}"></i>`;
                if (button.text) html += `<label>${button.text}</label>`;
                html += `</button>`;
            }

            el.innerHTML = html;

            return el;
        }

        /**
         * Monta a estrutura: Caixa da mensagem.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {HTMLElement} Elemento HTML.
         */
        private static makeBox(configuration: Configuration): HTMLElement {
            const elTitle = Alert.makeTitle(configuration);
            const elType = Alert.makeType(configuration);
            const elText = Alert.makeText(configuration);
            const elPrompt = Alert.makePrompt(configuration);
            const elButtons = Alert.makeButtons(configuration);

            const el = document.createElement("DIV") as HTMLDivElement;
            el.className = "dialog-box";

            if (elTitle) el.appendChild(elTitle);
            el.appendChild(elType);
            el.appendChild(elText);
            if (elPrompt) el.appendChild(elPrompt);
            el.appendChild(elButtons);

            return el;
        }

        /**
         * Monta a estrutura: tudo.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {HTMLElement} Elemento HTML.
         */
        private static makeDialog(configuration: Configuration): HTMLElement {
            const elBox = Alert.makeBox(configuration);

            const el = Core.Main.instance.presentation.createContainer(Alert.className);
            el.appendChild(elBox);

            return el;
        }

        /**
         * Exibe uma janela de diálogo ao usuário.
         * @param {Configuration} configuration Configuração do Dialog.
         * @returns {Promise<Result>} Quando fechar a janela retorna o resultado.
         */
        public static show(configuration: Configuration): Promise<Result> {
            if (!configuration.buttons.length) throw new Errors.EmptyValue("List of buttons.");

            Alert.stylesheet();

            return new Promise(resolve => {
                const elDialog = Alert.makeDialog(configuration);
                console.Log("New DialogAlert displayed: <{tagName} id=\"{id}\" />", elDialog, "Layout.Dialog", elDialog);

                const buttons = elDialog.querySelectorAll("button");

                /**
                 * Aplica o foco inicial.
                 */
                const focus = (): void => {
                    let toFocus: HTMLElement|null = elDialog.querySelector(`input`);
                    if (toFocus) (toFocus as HTMLInputElement).select();
                    else {
                        toFocus = elDialog.querySelector(`button.button-focus`);
                        if (!toFocus) toFocus = elDialog.querySelector(`button[data-index="0"]`);
                    }
                    if (toFocus) toFocus.focus();
                };
                setTimeout(focus, 1);

                /**
                 * Capturar tecla de atalho.
                 * @param {KeyboardEvent} evt Informações sobre o evento.
                 */
                const key = (evt: KeyboardEvent): void => {
                    if (!Util.DOM.isBring(elDialog, Types.BackFront.Front)) return;
                    let button: HTMLButtonElement|null = null;
                    switch (evt.keyCode) {
                        case 27:
                            const input = elDialog.querySelector("input");
                            if (input) input.value = "";
                            button = elDialog.querySelector(".button-escape");
                            break;
                        case 13:
                            button = elDialog.querySelector(".button-focus, button[data-index='0']");
                            break;
                    }
                    if (button) button.click();
                }
                window.addEventListener("keyup", key as any);

                /**
                 * Clique em um botão.
                 * @param {MouseEvent} evt Informações sobre o evento.
                 */
                const buttonClick = (evt: MouseEvent): void => {
                    const targets = (Array.isArray((evt as any).path) ? (evt as any).path : Util.DOM.path(evt.target as any)) as HTMLElement[];
                    const elButton = targets.filter(v => v.tagName === "BUTTON")[0];
                    const buttonIndex = Number.parseInt(elButton.getAttribute("data-index") as string);
                    const button = configuration.buttons[buttonIndex];
                    const input = elDialog.querySelector("input");
                    if (!button.escape && input && configuration.input && configuration.input.validate) {
                        if (!configuration.input.validate(input.value)) {
                            input.select();
                            input.focus();
                            input.classList.add("invalid");
                            return;
                        }
                    }
                    resolve({
                        button: button,
                        input: !input ? undefined : (input as HTMLInputElement).value,
                    });

                    window.removeEventListener("keyup", key as any);

                    elDialog.remove();

                    console.Log("DialogAlert closed: <{tagName} id=\"{id}\" />", elDialog, "Layout.Dialog", elDialog);
                };
                buttons.forEach(el => el.addEventListener('click', buttonClick));
            });
        }

        /**
         * Mensagem de alerta.
         * @param {string} text Texto.
         * @param {string} title Título.
         * @param {Type} type Título.
         * @param {string} labelOk Texto do botão Não.
         */
        public static alert(text?: string, title?: string, type: Type = Type.None, labelOk: string = "Ok"): void {
            Alert.show({
                text: text ? text : "",
                title: title,
                type: type,
                buttons: [{
                    text: labelOk.translate(),
                    icon: "far fa-check-circle",
                    focus: true,
                    escape: true
                }]
            });
        }

        /**
         * Mensagem de alerta: Information
         * @param {string} text Texto.
         * @param {string} title Título.
         * @param {string} labelOk Texto do botão Não.
         */
        public static info(text?: string, title?: string, labelOk: string = "Ok"): void {
            return Alert.alert(text, title, Type.Information, labelOk);
        }

        /**
         * Mensagem de alerta: Warning
         * @param {string} text Texto.
         * @param {string} title Título.
         * @param {string} labelOk Texto do botão Não.
         */
        public static warn(text?: string, title?: string, labelOk: string = "Ok"): void {
            return Alert.alert(text, title, Type.Warning, labelOk);
        }

        /**
         * Mensagem de alerta: Error
         * @param {string} text Texto.
         * @param {string} title Título.
         * @param {string} labelOk Texto do botão Não.
         */
        public static error(text?: string, title?: string, labelOk: string = "Ok"): void {
            return Alert.alert(text, title, Type.Error, labelOk);
        }

        /**
         * Mensagem de confirmação.
         * @param {string} text Texto.
         * @param {string} title Título.
         * @param {Type} type Título.
         * @param {string} labelNo Texto do botão Não.
         * @param {string} labelYes Texto do botão Sim.
         * @returns {Promise<void>} Retorna apenas se a confirmação for verdadeira.
         */
        public static confirm(text?: string, title?: string, type: Type = Type.Question, labelNo: string = "No", labelYes: string = "Yes"): Promise<void> {
            return new Promise(resolve => {
                Alert.show({
                    text: text ? text : "",
                    title: title,
                    type: type,
                    buttons: [
                        {
                            text: labelNo.translate(),
                            icon: "far fa-times-circle",
                            escape: true
                        },
                        {
                            text: labelYes.translate(),
                            icon: "far fa-check-circle",
                            focus: true
                        }
                    ]
                }).then(result => {
                    if (result.button.focus) resolve();
                });
            });
        }

        /**
         * Mensagem de pergunta Sim ou Não.
         * @param {string} text Texto.
         * @param {string} title Título.
         * @param {string} defaults Valor inicial.
         * @param {(value: string) => boolean} validate Valida o valor inserido.
         * @param {Type} type Título.
         * @param {string} labelOk Texto do botão Ok.
         * @returns {Promise<string>} Retorna o valor inserido.
         */
        public static prompt(text?: string, title?: string, defaults: string = "", validate?: (value: string) => boolean, type: Type = Type.Input, labelOk: string = "Ok"): Promise<string> {
            return new Promise(resolve => {
                Alert.show({
                    text: text ? text : "",
                    title: title,
                    type: type,
                    input: {
                        defaults: defaults,
                        validate: validate
                    },
                    buttons: [
                        {
                            text: labelOk.translate(),
                            icon: "far fa-check-circle",
                            focus: true,
                            escape: false
                        }
                    ]
                }).then(result => {
                    resolve(result.input);
                });
            });
        }
    }
}
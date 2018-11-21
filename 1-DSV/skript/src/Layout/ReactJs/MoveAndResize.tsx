namespace Skript.Layout.ReactJs {
    
    /**
     * Ações do usuário.
     */
    enum Action { 

        /**
         * Indefinido.
         */
        None,

        /**
         * Mover elemento.
         */
        Move, 

        /**
         * Redimensionar elemento.
         */
        Resize 
    }

    /**
     * Informações de controle.
     */
    type Control = {

        /**
         * Ação.
         * @type {Action}
         */
        action: Action,

        /**
         * Está com clique pressionado.
         * @type {boolean}
         */
        clicking: boolean,

        /**
         * O movimento foi iniciado.
         * @type {boolean}
         */
        moving: boolean,

        /**
         * Informa se o clique é válido (ou se foi apenas arrastado).
         * @type {boolean}
         */
        clicked: boolean,

        /**
         * Informações de posicionamento.
         * @type {{horizontal: number, vertical: number}}
         */
        offset: { 

            /**
             * Informações de posicionamento horizontal.
             * @type {number}
             */
            horizontal: number,

            /**
             * Informações de posicionamento vertical.
             * @type {number}
             */
            vertical: number
        },

        /**
         * Posição do mouse.
         * @type {{x: number, y: number}}
         */
        mouse: { 

            /**
             * Posição horizontal.
             * @type {number}
             */
            x: number, 

            /**
             * Posição vertical.
             * @type {number}
             */
            y: number
        },

        /**
         * Identificado da última solicitação de FrameAnimation
         * @type {number}
         */
        idFrameAnimation: number
    }

    /**
     * Configuração de inicialização.
     */
    export type MoveAndResizeConfiguration = { 

        /**
         * Componente responsável.
         * @type {React.Component}
         */
        owner: React.Component,

        /**
         * Elemento container.
         * @type {HTMLElement}
         */
        elContainer: HTMLElement,

        /**
         * Lista de elementos que iniciam a ação de mover.
         * @type {HTMLElement[]}
         */
        elMove: HTMLElement[]

        /**
         * Lista de elementos que iniciam a ação de redimensionar.
         * @type {HTMLElement[]}
         */
        elResize: HTMLElement[]

        /**
         * Retorna true para indicar que o container não precisa ser movido para frente ao mover.
         * @type {Function}
         */
        ignoreBringToFront?: Function,

        /**
         * Retorna true para indicar que qualquer ação de mover ou redimensionar deve ser ignorada.
         * @type {Function}
         */
        ignoreEventClick?: Function,

        /**
         * Função chamada sempre que redimensionar.
         * @type {Function}
         */
        onResize?: Function
    }

    /**
     * Implementa o arrastar e redimensionar em elementos.
     * O container deve ter position: fixed ou absolute.
     */
    export class MoveAndResize {

        /**
         * Lista de instancias que instanciaram esta classe.
         * @type {MoveAndResize[]}
         */
        private static instances: MoveAndResize[] = [];        

        /**
         * Determina a ação do usuário com base nas informações de controle.
         * @param {MoveAndResize} instance Instância.
         * @param {HTMLElement[]} targets Lista de elementos que aceitam mover ou redimensionar.
         * @returns {Action} Ação determinada.
         */
        private static determineAction(instance: MoveAndResize, targets: HTMLElement[]): Action {
            for (const j in instance.configuration.elResize) {
                if (targets.indexOf(instance.configuration.elResize[j]) >= 0) {
                    return Action.Resize;
                }
            }
            for (const j in instance.configuration.elMove) {
                if (targets.indexOf(instance.configuration.elMove[j]) >= 0) {
                    return Action.Move;
                }
            }
            return Action.None;
        }
        
        /**
         * Remove uma instância da lista caso o container tenha saído do DOM.
         * @param {MoveAndResize[]} instances Lista de instâncias.
         * @param {string} index Posição da instância sendo verificada.
         */
        public static checkIfRemoved(instances: MoveAndResize[], index: string): MoveAndResize|undefined {
            const instance = instances[parseInt(index)];
            let element = instance.configuration.elContainer;
            do {
                if (element === document.body) return instance;
            } while (element = element.parentElement as HTMLElement);
            delete instances[parseInt(index)];
            return undefined;
        }

        /**
         * Construtor.
         * @param {MoveAndResizeConfiguration} configuration Configuração de inicialização.
         */
        public constructor(configuration: MoveAndResizeConfiguration) {
            this.configuration = configuration;
            this.control = {
                action: Action.Move,
                clicking: false,
                moving: false,
                clicked: false,
                offset: { 
                    horizontal: 0,
                    vertical: 0
                },
                mouse: { 
                    x: 0, 
                    y: 0
                },        
                idFrameAnimation: 0
            }

            MoveAndResize.instances.push(this);
            this.addEventListener();
        }

        /**
         * Configuração de inicialização.
         * @type {MoveAndResizeConfiguration}
         */
        public configuration: MoveAndResizeConfiguration;

        /**
         * Informações de controle.
         * @type {Control}
         */
        public control: Control;

        /**
         * Registra os handlers dos eventos.
         */
        private addEventListener() {
            window.addEventListener("mousedown", this.onWindowMouseDown);
            for (const i in this.configuration.elMove) this.configuration.elMove[i].addEventListener("touchstart", this.onWindowMouseDown);
            for (const i in this.configuration.elResize) this.configuration.elResize[i].addEventListener("touchstart", this.onWindowMouseDown);

            window.addEventListener("mouseup", this.onWindowMouseUp);
            for (const i in this.configuration.elMove) this.configuration.elMove[i].addEventListener("touchend", this.onWindowMouseUp);
            for (const i in this.configuration.elResize) this.configuration.elResize[i].addEventListener("touchend", this.onWindowMouseUp);

            window.addEventListener("mousemove", this.onWindowMouseMove);
            for (const i in this.configuration.elMove) this.configuration.elMove[i].addEventListener("touchmove", this.onWindowMouseMove);
            for (const i in this.configuration.elResize) this.configuration.elResize[i].addEventListener("touchmove", this.onWindowMouseMove);
        }

        /**
         * Evento: mouse ou toque apertado qualquer área da janela.
         * @param {any} ev Informações do evento.
         */
        private onWindowMouseDown(ev: any): void {
            const targets: any[] = Array.isArray(ev.path) ? ev.path : [ev.target];
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.checkIfRemoved(MoveAndResize.instances, i); if (!instance) continue;

                if (instance.configuration.ignoreEventClick instanceof Function &&
                    instance.configuration.ignoreEventClick.bind(instance.configuration.owner)(ev)) continue;

                if (targets.indexOf(instance.configuration.elContainer) >= 0) {
                    instance.onContainerMouseDown(ev);
                }

                instance.control.action = MoveAndResize.determineAction(instance, targets);
                instance.control.clicking = instance.control.action !== Action.None;
                instance.control.clicked = true;

                const elements = instance.configuration.elMove.concat(instance.configuration.elResize);
                for (const j in elements) {
                    if (targets.indexOf(elements[j]) >= 0) {
                        instance.onElementsMouseDown(ev);
                        break;
                    }
                }
            }
        }        

        /**
         * Evento: mouse ou toque liberado em toda a tela.
         * @param {any} ev Informações do evento.
         */
        private onWindowMouseUp(): void {
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.checkIfRemoved(MoveAndResize.instances, i); if (!instance) continue;

                instance.control.action = Action.None;
                instance.control.clicking = false;
                instance.control.moving = false;

                window.cancelAnimationFrame(instance.control.idFrameAnimation);
            }
        }

        /**
         * Evento: mouse ou toque em movimento.
         * @param {any} ev Informações do evento.
         */
        private onWindowMouseMove(ev: any): void {
            let proccessed = false;

            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.checkIfRemoved(MoveAndResize.instances, i); if (!instance) continue;

                if (!instance.control.clicking) continue;

                ev.preventDefault();
    
                instance.control.mouse = {        
                    x: ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX,
                    y: ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY
                };

                if (instance.control.moving) {
                    instance.control.clicked = false;
                }
                if (!instance.control.moving) {
                    instance.control.moving = true;
                    instance.control.idFrameAnimation = 
                        window.requestAnimationFrame(instance.onFrameAnimation);
                } 
                
                proccessed = true;
            }

            if (proccessed) Util.DOM.clearSelection();
        }

        /**
         * Quando o elemento container é ativado.
         * @param {any} ev Informações do evento.
         */
        private onContainerMouseDown(ev: any): void {
            if (this.configuration.ignoreBringToFront instanceof Function &&
                this.configuration.ignoreBringToFront(ev)) return;

            Util.DOM.bring(this.configuration.elContainer.parentElement as HTMLElement, Util.BringTo.Front);
        }

        /**
         * Lógica para mouse ou toque apertado.
         * Evento individual para cada instância dessa classe.
         * @param {any} ev Informações do evento.
         */
        private onElementsMouseDown(ev: any): void {
            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            this.control.offset = {
                horizontal: this.configuration.elContainer.offsetLeft - clientX,
                vertical: this.configuration.elContainer.offsetTop - clientY
            };
        }

        /**
         * Lógica para move ou redimensionar.
         */
        private onFrameAnimation(): void {
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                if (!instance.control.clicking) continue;

                switch (instance.control.action) {
                    case Action.Move:
                        instance.configuration.elContainer.style.left = (instance.control.mouse.x + instance.control.offset.horizontal) + 'px';
                        instance.configuration.elContainer.style.top = (instance.control.mouse.y + instance.control.offset.vertical) + 'px';
                        instance.configuration.elContainer.style.right = "auto";
                        instance.configuration.elContainer.style.bottom = "auto";
                        break;
                    case Action.Resize:
                        const diff = 4;
                        instance.configuration.elContainer.style.width = diff + (instance.control.mouse.x - instance.configuration.elContainer.offsetLeft) + 'px';
                        instance.configuration.elContainer.style.height = diff + (instance.control.mouse.y - instance.configuration.elContainer.offsetTop) + 'px';
                        if (instance.configuration.onResize instanceof Function) {
                            instance.configuration.onResize.bind(instance.configuration.owner)();
                        }
                        break;
                    default:
                        return;
                }
                instance.control.idFrameAnimation = window.requestAnimationFrame(instance.onFrameAnimation);
            }
        }
    }
}

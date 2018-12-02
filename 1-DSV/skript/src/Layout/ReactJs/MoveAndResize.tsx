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
         * Ignorar mover.
         */
        IgnoreMove,

        /**
         * Redimensionar elemento.
         */
        Resize,

        /**
         * Ignorar mover.
         */
        IgnoreResize
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
         * @type {Core.Position}
         */
        offset: Core.Position,

        /**
         * Posição do mouse.
         * @type {Core.Position}
         */
        mouse: Core.Position,

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
         * @type {(evt: any) => void}
         */
        ignoreBringToFront?: (evt: any) => boolean,

        /**
         * Retorna true para indicar que qualquer ação de mover ou redimensionar deve ser ignorada.
         * @type {(evt: any) => void}
         */
        ignoreEventClick?: (evt: any) => void,

        /**
         * Função chamada sempre que redimensionar.
         * @type {() => void}
         */
        onResize?: () => void
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
         * @param {Element[]} targets Lista de elementos que aceitam mover ou redimensionar.
         * @returns {Action} Ação determinada.
         */
        private static determineAction(instance: MoveAndResize, targets: Element[]): Action {
            for (const j in instance.configuration.elResize) {
                if (targets.indexOf(instance.configuration.elResize[j]) >= 0) {
                    return !instance.ignoreResize ? Action.Resize : Action.IgnoreResize;
                }
            }
            for (const j in instance.configuration.elMove) {
                if (targets.indexOf(instance.configuration.elMove[j]) >= 0) {
                    return !instance.ignoreMove ? Action.Move : Action.IgnoreMove;
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
                    x: 0,
                    y: 0
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
         * Ingnora movimento.
         */
        public ignoreMove: boolean = false;

        /**
         * Ingnora resize.
         */
        public ignoreResize: boolean = false;

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
         * @param {any} evt Informações do evento.
         */
        private onWindowMouseDown(evt: any): void {
            if (!evt.target) return;
        
            const targets: Element[] = Array.isArray(evt.path) ? evt.path : Util.DOM.path(evt.target);
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.checkIfRemoved(MoveAndResize.instances, i); if (!instance) continue;

                if (instance.configuration.ignoreEventClick &&
                    instance.configuration.ignoreEventClick.bind(instance.configuration.owner)(evt)) continue;

                if (targets.indexOf(instance.configuration.elContainer) >= 0)
                    instance.onContainerActivate(evt);
        
                instance.control.action = MoveAndResize.determineAction(instance, targets);
                instance.control.clicking = instance.control.action !== Action.None;
                instance.control.clicked = true;

                const elements = instance.configuration.elMove.concat(instance.configuration.elResize);
                for (const j in elements) {
                    if (targets.indexOf(elements[j]) >= 0) {
                        instance.onElementsMouseDown(evt);
                        break;
                    }
                }
            }
        }        

        /**
         * Evento: mouse ou toque liberado em toda a tela.
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
         * @param {any} evt Informações do evento.
         */
        private onWindowMouseMove(evt: any): void {
            let processed = false;

            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.checkIfRemoved(MoveAndResize.instances, i); if (!instance) continue;

                if (!instance.control.clicking) continue;

                evt.preventDefault();
    
                instance.control.mouse = {        
                    x: evt.changedTouches !== undefined ? evt.changedTouches[0].clientX : evt.clientX,
                    y: evt.changedTouches !== undefined ? evt.changedTouches[0].clientY : evt.clientY
                };

                if (instance.control.moving) {
                    instance.control.clicked = false;
                }
                if (!instance.control.moving) {
                    instance.control.moving = true;
                    instance.control.idFrameAnimation = 
                        window.requestAnimationFrame(instance.onFrameAnimation);
                } 
                
                processed = true;
            }

            if (processed) Util.DOM.clearSelection();
        }

        /**
         * Quando o elemento container é ativado.
         * @param {any} evt Informações do evento.
         */
        private onContainerActivate(evt: any): void {
            if (Util.DOM.isBring(this.configuration.elContainer.parentElement as HTMLElement, Util.BringTo.Front)) return;

            const ignoreBringToFront = this.configuration.ignoreBringToFront ? this.configuration.ignoreBringToFront : (evt: any): boolean => {
                const targets: Element[] = Array.isArray(evt.path) ? evt.path : Util.DOM.path(evt.target);
                return !!targets.reduce((a: any, c: any) => c.classList && c.classList.contains("dialog-action") ? c : a, null);
            };
            if (ignoreBringToFront(evt)) return;

            Util.DOM.bring(this.configuration.elContainer.parentElement as HTMLElement, Util.BringTo.Front);
        }

        /**
         * Lógica para mouse ou toque apertado.
         * Evento individual para cada instância dessa classe.
         * @param {any} evt Informações do evento.
         */
        private onElementsMouseDown(evt: any): void {
            const clientX = evt.changedTouches !== undefined ? evt.changedTouches[0].clientX : evt.clientX;
            const clientY = evt.changedTouches !== undefined ? evt.changedTouches[0].clientY : evt.clientY;

            this.control.offset = {
                x: this.configuration.elContainer.offsetLeft - clientX,
                y: this.configuration.elContainer.offsetTop - clientY
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
                        instance.configuration.elContainer.style.left = (instance.control.mouse.x + instance.control.offset.x) + 'px';
                        instance.configuration.elContainer.style.top = (instance.control.mouse.y + instance.control.offset.y) + 'px';
                        instance.configuration.elContainer.style.right = "auto";
                        instance.configuration.elContainer.style.bottom = "auto";
                        break;
                    case Action.Resize:
                        const diff = 4;
                        instance.configuration.elContainer.style.width = diff + (instance.control.mouse.x - instance.configuration.elContainer.offsetLeft) + 'px';
                        instance.configuration.elContainer.style.height = diff + (instance.control.mouse.y - instance.configuration.elContainer.offsetTop) + 'px';
                        if (instance.configuration.onResize) instance.configuration.onResize.bind(instance.configuration.owner)();
                        break;
                    default:
                        return;
                }
                instance.control.idFrameAnimation = window.requestAnimationFrame(instance.onFrameAnimation);
            }
        }
    }
}

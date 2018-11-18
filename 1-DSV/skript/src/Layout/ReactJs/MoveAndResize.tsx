namespace Layout.ReactJs {
    
    enum Action { 
        None,
        Move, 
        Resize 
    }

    type ControlInfo = {
        action: Action,
        clicked: boolean,
        moving: boolean,
        offset: { 
            horizontal: number,
            vertical: number
        },
        mouse: { 
            x: number, 
            y: number
        },        
        idFrameAnimation: number
    }

    export type MoveAndResizeConfig = { 
        owner: React.Component,
        elContainer: HTMLElement,
        elMove: HTMLElement[]
        elResize: HTMLElement[]
        onResize?: Function
    }

    /**
     * Implementa o arrastar e redimensionar em elementos.
     * O container deve ter position: fixed ou absolute.
     */
    export class MoveAndResize {

        private static instances: MoveAndResize[] = [];        

        private static determineAction(instance: MoveAndResize, targets: HTMLElement[]): Action {
            for (const j in instance.config.elResize) {
                if (targets.indexOf(instance.config.elResize[j]) >= 0) {
                    return Action.Resize;
                }
            }
            for (const j in instance.config.elMove) {
                if (targets.indexOf(instance.config.elMove[j]) >= 0) {
                    return Action.Move;
                }
            }
            return Action.None;
        }
        
        public constructor(config: MoveAndResizeConfig) {
            this.config = config;
            this.controlInfo = {
                action: Action.Move,
                clicked: false,
                moving: false,
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

        private config: MoveAndResizeConfig;

        private controlInfo: ControlInfo;

        private addEventListener() {
            window.addEventListener("mousedown", this.onWindowMouseDown);
            window.addEventListener("touchstart", this.onWindowMouseDown);

            window.addEventListener("mouseup", this.onWindowMouseUp);
            window.addEventListener("touchend", this.onWindowMouseUp);

            window.addEventListener("mousemove", this.onWindowMouseMove);
            window.addEventListener("touchmove", this.onWindowMouseMove);
        }

        private onWindowMouseDown(ev: any): void {
            const targets: any[] = Array.isArray(ev.path) ? ev.path : [ev.target];
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                if (targets.indexOf(instance.config.elContainer) >= 0) {
                    instance.onContainerMouseDown();
                }

                instance.controlInfo.action = MoveAndResize.determineAction(instance, targets);
                instance.controlInfo.clicked = instance.controlInfo.action !== Action.None;

                const elements = instance.config.elMove.concat(instance.config.elResize);
                for (const j in elements) {
                    if (targets.indexOf(elements[j]) >= 0) {
                        instance.onElementsMouseDown(ev);
                        break;
                    }
                }
            }
        }
        
        private onWindowMouseUp(): void {
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                instance.controlInfo.action = Action.None;
                instance.controlInfo.clicked = false;
                instance.controlInfo.moving = false;

                window.cancelAnimationFrame(instance.controlInfo.idFrameAnimation);
            }
        }

        private onWindowMouseMove(ev: any): void {
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                if (!instance.controlInfo.clicked) continue;

                ev.preventDefault();
    
                instance.controlInfo.mouse = {        
                    x: ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX,
                    y: ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY
                };

                if (!instance.controlInfo.moving) {
                    instance.controlInfo.moving = true;
                    instance.controlInfo.idFrameAnimation = 
                        window.requestAnimationFrame(instance.onFrameAnimation);
                }    
            }
        }

        private onContainerMouseDown(): void {
            Util.DOM.bring(this.config.elContainer.parentElement as HTMLElement, Util.BringTo.Front);
        }

        private onElementsMouseDown(ev: any): void {
            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            this.controlInfo.offset = {
                horizontal: this.config.elContainer.offsetLeft - clientX,
                vertical: this.config.elContainer.offsetTop - clientY
            };
        }

        private onFrameAnimation(): void {
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                if (!instance.controlInfo.clicked) continue;

                switch (instance.controlInfo.action) {
                    case Action.Move:
                        instance.config.elContainer.style.left = (instance.controlInfo.mouse.x + instance.controlInfo.offset.horizontal) + 'px';
                        instance.config.elContainer.style.top = (instance.controlInfo.mouse.y + instance.controlInfo.offset.vertical) + 'px';
                        break;
                    case Action.Resize:
                        const diff = 4;
                        instance.config.elContainer.style.width = diff + (instance.controlInfo.mouse.x - instance.config.elContainer.offsetLeft) + 'px';
                        instance.config.elContainer.style.height = diff + (instance.controlInfo.mouse.y - instance.config.elContainer.offsetTop) + 'px';
                        if (instance.config.onResize instanceof Function) {
                            instance.config.onResize.bind(instance.config.owner)();
                        }
                        break;
                    default:
                        return;
                }
                instance.controlInfo.idFrameAnimation = window.requestAnimationFrame(instance.onFrameAnimation);
            }
        }

    }
}

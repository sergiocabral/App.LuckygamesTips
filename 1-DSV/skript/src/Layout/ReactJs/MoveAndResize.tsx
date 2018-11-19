namespace Skript.Layout.ReactJs {
    
    enum Action { 
        None,
        Move, 
        Resize 
    }

    type ControlInfo = {
        action: Action,
        clicking: boolean,
        moving: boolean,
        clicked: boolean,
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
        ignoreBringToFront?: Function,
        ignoreEventClick?: Function,
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

        public config: MoveAndResizeConfig;

        public controlInfo: ControlInfo;

        private addEventListener() {
            window.addEventListener("mousedown", this.onWindowMouseDown);
            for (const i in this.config.elMove) this.config.elMove[i].addEventListener("touchstart", this.onWindowMouseDown);
            for (const i in this.config.elResize) this.config.elResize[i].addEventListener("touchstart", this.onWindowMouseDown);

            window.addEventListener("mouseup", this.onWindowMouseUp);
            for (const i in this.config.elMove) this.config.elMove[i].addEventListener("touchend", this.onWindowMouseUp);
            for (const i in this.config.elResize) this.config.elResize[i].addEventListener("touchend", this.onWindowMouseUp);

            window.addEventListener("mousemove", this.onWindowMouseMove);
            for (const i in this.config.elMove) this.config.elMove[i].addEventListener("touchmove", this.onWindowMouseMove);
            for (const i in this.config.elResize) this.config.elResize[i].addEventListener("touchmove", this.onWindowMouseMove);
        }

        private onWindowMouseDown(ev: any): void {
            const targets: any[] = Array.isArray(ev.path) ? ev.path : [ev.target];
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                if (instance.config.ignoreEventClick instanceof Function &&
                    instance.config.ignoreEventClick.bind(instance.config.owner)(ev)) continue;

                if (targets.indexOf(instance.config.elContainer) >= 0) {
                    instance.onContainerMouseDown(ev);
                }

                instance.controlInfo.action = MoveAndResize.determineAction(instance, targets);
                instance.controlInfo.clicking = instance.controlInfo.action !== Action.None;
                instance.controlInfo.clicked = true;

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
                instance.controlInfo.clicking = false;
                instance.controlInfo.moving = false;

                window.cancelAnimationFrame(instance.controlInfo.idFrameAnimation);
            }
        }

        private onWindowMouseMove(ev: any): void {
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                if (!instance.controlInfo.clicking) continue;

                ev.preventDefault();
    
                instance.controlInfo.mouse = {        
                    x: ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX,
                    y: ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY
                };

                if (instance.controlInfo.moving) {
                    instance.controlInfo.clicked = false;
                }
                if (!instance.controlInfo.moving) {
                    instance.controlInfo.moving = true;
                    instance.controlInfo.idFrameAnimation = 
                        window.requestAnimationFrame(instance.onFrameAnimation);
                }    
            }
        }

        private onContainerMouseDown(ev: any): void {
            if (this.config.ignoreBringToFront instanceof Function &&
                this.config.ignoreBringToFront(ev)) return;

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

                if (!instance.controlInfo.clicking) continue;

                switch (instance.controlInfo.action) {
                    case Action.Move:
                        instance.config.elContainer.style.left = (instance.controlInfo.mouse.x + instance.controlInfo.offset.horizontal) + 'px';
                        instance.config.elContainer.style.top = (instance.controlInfo.mouse.y + instance.controlInfo.offset.vertical) + 'px';
                        instance.config.elContainer.style.right = "auto";
                        instance.config.elContainer.style.bottom = "auto";
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

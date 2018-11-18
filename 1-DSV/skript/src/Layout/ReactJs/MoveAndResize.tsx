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
        elContainer: HTMLElement,
        elMove: HTMLElement[]
        elResize: HTMLElement[]
        onResize?: Function
    }

    /**
     * Implementa o arrastar e redimensionar em elementos.
     */
    export class MoveAndResize {

        private static instances: MoveAndResize[] = [];        

        private static determineAction(instance: MoveAndResize, targets: HTMLElement[]): Action {
            for (const j in instance.elResize) {
                if (targets.indexOf(instance.elResize[j]) >= 0) {
                    return Action.Resize;
                }
            }
            for (const j in instance.elMove) {
                if (targets.indexOf(instance.elMove[j]) >= 0) {
                    return Action.Move;
                }
            }
            return Action.None;
        }
        
        public constructor(config: MoveAndResizeConfig) {

            this.elContainer = config.elContainer;
            this.elMove = config.elMove;
            this.elResize = config.elResize;

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

        private elContainer: HTMLElement;

        private elMove: HTMLElement[];
        
        private elResize: HTMLElement[];

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

                if (targets.indexOf(instance.elContainer) >= 0) {
                    instance.onContainerMouseDown();
                }

                instance.controlInfo.action = MoveAndResize.determineAction(instance, targets);
                instance.controlInfo.clicked = instance.controlInfo.action !== Action.None;

                const elements = instance.elMove.concat(instance.elResize);
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
            Util.DOM.bring(this.elContainer.parentElement as HTMLElement, Util.BringTo.Front);
        }

        private onElementsMouseDown(ev: any): void {
            const clientX = ev.changedTouches !== undefined ? ev.changedTouches[0].clientX : ev.clientX;
            const clientY = ev.changedTouches !== undefined ? ev.changedTouches[0].clientY : ev.clientY;

            this.controlInfo.offset = {
                horizontal: this.elContainer.offsetLeft - clientX,
                vertical: this.elContainer.offsetTop - clientY
            };
        }

        private onFrameAnimation(): void {
            for (const i in MoveAndResize.instances) {
                const instance = MoveAndResize.instances[i];

                if (!instance.controlInfo.clicked) continue;

                switch (instance.controlInfo.action) {
                    case Action.Move:
                        instance.elContainer.style.left = (instance.controlInfo.mouse.x + instance.controlInfo.offset.horizontal) + 'px';
                        instance.elContainer.style.top = (instance.controlInfo.mouse.y + instance.controlInfo.offset.vertical) + 'px';
                        break;
                    case Action.Resize:
                        const diff = 4;
                        instance.elContainer.style.width = diff + (instance.controlInfo.mouse.x - instance.elContainer.offsetLeft) + 'px';
                        instance.elContainer.style.height = diff + (instance.controlInfo.mouse.y - instance.elContainer.offsetTop) + 'px';
                        break;
                    default:
                        return;
                }
                instance.controlInfo.idFrameAnimation = window.requestAnimationFrame(instance.onFrameAnimation);
            }
        }

    }
}

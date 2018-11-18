namespace Layout.ReactJs {
    
    type ControlInfo = {
        clicked: boolean,
        moving: boolean,
        resizing: boolean,
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

    /**
     * Implementa o arrastar e redimensionar em elementos.
     */
    export class MoveAndResize {

        private static instances: MoveAndResize[] = [];
        
        public constructor(
            config: { 
                elContainer: HTMLElement,
                elMove: HTMLElement[]
                elResize: HTMLElement[]
            }) {

            this.elContainer = config.elContainer;
            this.elMove = config.elMove;
            this.elResize = config.elResize;

            this.controlInfo = {
                clicked: false,
                moving: false,
                resizing: false,
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

                const elements = instance.elMove.concat(instance.elResize);
                for (const j in elements) {
                    if (targets.indexOf(elements[j]) >= 0) {
                        instance.onElementsMouseDown(ev);
                        break;
                    }
                }
            }
        }
        
        private onWindowMouseUp(ev: any): void {
            for (const i in MoveAndResize.instances) {
                MoveAndResize.instances[i].onMouseUp(ev);
            }
        }

        private onWindowMouseMove(ev: any): void {
            for (const i in MoveAndResize.instances) {
                MoveAndResize.instances[i].onMouseMove(ev);
            }
        }

        private onContainerMouseDown(): void {
            Util.DOM.bring(this.elContainer.parentElement as HTMLElement, Util.BringTo.Front);
        }

        private onElementsMouseDown(ev: Event): void {
            this.controlInfo=this.controlInfo;
            console.log("onElementsMouseDown", ev, this); 
        }
        
        private onMouseUp(ev: any): void {
            console.log("onMouseUp", ev, this);
        }

        private onMouseMove(ev: any): void {
            this.elContainer || this.elMove || this.elResize;

            ev || ev; //console.log("onWindowMouseMove", ev);
        }

    }
}

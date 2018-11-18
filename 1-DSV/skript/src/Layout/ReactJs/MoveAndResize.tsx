namespace Layout.ReactJs {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const tips: Core.All;

    /**
     * Implementa o arrastar e redimensionar em elementos.
     */
    export class MoveAndResize {    
        
        public constructor(
            config: { 
                elContainer: HTMLElement,
                elMove: HTMLElement[]
                elResize: HTMLElement[]
            }) {

            this.elContainer = config.elContainer;
            this.elMove = config.elMove;
            this.elResize = config.elResize;

            if (!tips.any["MoveAndResize"]) {
                tips.any["MoveAndResize"] = [];
                this.addEventListener();
            }
            tips.any["MoveAndResize"].push(this);
        }

        private elContainer: HTMLElement;

        private elMove: HTMLElement[];
        
        private elResize: HTMLElement[];

        private addEventListener() {
            window.addEventListener("mousedown", this.onMouseDown);
            window.addEventListener("touchstart", this.onMouseDown);

            window.addEventListener("mouseup", this.onMouseUp);
            window.addEventListener("touchend", this.onMouseUp);

            window.addEventListener("mousemove", this.onMouseMove);
            window.addEventListener("touchmove", this.onMouseMove);
        }

        /**
         * Clique do mouse para ativar, arrastar ou redimensionar.
         * @param {any} ev 
         */
        private onMouseDown(ev: Event): void {
            console.log("onMouseDown", ev, this); 
            this.elContainer || this.elMove || this.elResize;
        }
        
        /**
         * Quando o mouse é liberado e para tudo que estava sendo feito.
         */
        private onMouseUp(ev: any): void {
            console.log("onMouseUp", ev);
        }

        /**
         * Movimento do mouse.
         * @param {any} ev 
         */
        private onMouseMove(ev: any): void {
            ev || ev; //console.log("onMouseMove", ev);
        }
    }
}

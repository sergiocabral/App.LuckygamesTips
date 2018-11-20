namespace Skript.Parts.LuckygamesAdjusts {
    
    /**
     * Ajustes no ambiente da luckygames.io
     */
    export class Part extends PartBase {
        
        /**
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void {
            this.tools.log.post("LuckygamesAdjusts");
        }
        
    }
    
    new Part();
}
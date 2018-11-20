namespace Skript.Parts.User.LuckygamesAdjusts {
    
    /**
     * Ajustes no ambiente da luckygames.io
     */
    class Part extends PartBase {
        
        /**
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void {
            this.tools.log.post("LuckygamesAdjusts");
        }
        
    }
    
    new Part();
}
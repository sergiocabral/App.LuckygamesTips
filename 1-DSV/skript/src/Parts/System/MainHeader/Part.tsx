namespace Skript.Parts.System.MainHeader {
    
    /**
     * Cabeçalho principal sobre o sistema.
     */
    export class Part extends PartBase {
        
        /**
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void {
            this.tools.log.post("MainHeader");
        }
        
    }

    new Part();
}
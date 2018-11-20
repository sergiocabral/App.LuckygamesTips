namespace Skript.Part.User.LuckygamesAdjusts {
    
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

        /**
         * Componente para inclusão na janela.
         * @returns {any} Qualquer coisa que seja adicionado como children em um component React.
         */
        public component(): any {
            return React.createElement(Component.Main, null, null);
        }
        
    }
    
    new Part();
}
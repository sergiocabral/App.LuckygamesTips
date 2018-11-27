namespace Skript.Part.User.LuckygamesAdjusts {
    
    /**
     * Ajustes no ambiente da luckygames.io
     */
    class Part extends PartBase {
        
        /**
         * Nome identificador do módulo.
         */
        public name: string = "LuckygamesAdjusts";
        
        /**
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void { }

        /**
         * Componente para inclusão na janela.
         * @returns {React.ReactNode} Qualquer coisa que seja adicionado como children em um component React.
         */
        public component(): React.ReactNode {
            return React.createElement(Component.LuckygamesAdjusts, null, null);
        }
        
    }
    
    new Part().register();
}
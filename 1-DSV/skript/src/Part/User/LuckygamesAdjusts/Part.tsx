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
        public loaded(): void {
            console.log("loaded TTTTTTTTTT");
        }

        /**
         * Componente para inclusão na janela.
         * @returns {React.ReactNode} Qualquer coisa que seja adicionado como children em um component React.
         */
        public component(): React.ReactNode {
            return React.createElement(Component.Main, null, null);
        }
        
    }
    
    new Part().register();
}
namespace Skript.Part.System.MainHeader {
    
    /**
     * Cabeçalho principal sobre o sistema.
     */
    class Part extends PartBase {
        
        /**
         * Nome identificador do módulo.
         */
        public name: string = "MainHeader";
        
        /**
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void { }

        /**
         * Componente para inclusão na janela.
         * @returns {React.ReactNode} Qualquer coisa que seja adicionado como children em um component React.
         */
        public component(): React.ReactNode {
            return React.createElement(Component.Main, this.tools, null);
        }
        
    }

    new Part().register();
}
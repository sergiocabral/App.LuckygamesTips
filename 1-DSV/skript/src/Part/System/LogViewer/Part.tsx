namespace Skript.Part.System.LogViewer {
    
    /**
     * Visualização do log do sistema.
     */
    class Part extends PartBase {
        
        /**
         * Nome identificador do módulo.
         */
        public name: string = "LogViewer";
        
        /**
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void { }

        /**
         * Componente para inclusão na janela.
         * @returns {React.ReactNode} Qualquer coisa que seja adicionado como children em um component React.
         */
        public component(): React.ReactNode {
            return React.createElement(Component.LogViewer, null, null);
        }
        
    }

    new Part().register();
}
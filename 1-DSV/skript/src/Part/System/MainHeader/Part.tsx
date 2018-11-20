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
        public loaded(): void {
            console.log("loaded WWWWWWWWWW");
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
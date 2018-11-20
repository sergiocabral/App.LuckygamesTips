namespace Skript.Part.System.MainHeader {
    
    /**
     * Cabeçalho principal sobre o sistema.
     */
    class Part extends PartBase {
        
        /**
         * Chamado quando o módulo é carregado.
         */
        public loaded(): void {
            this.tools.log.post("MainHeader");
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
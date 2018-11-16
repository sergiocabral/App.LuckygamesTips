namespace Layout.Theme {

    /**
     * Tema para customização de cores do layout.
     * Para ter ideias visite https://color.adobe.com/
     */
    export type Colors = {
        
        /**
         * Cor de texto em geral.
         */
        generalTextColor: string;

        /**
         * Fundo em geral.
         */
        generalBackground: string;

        /**
         * Cor do texto do título das janelas de diálogo.
         */
        dialogTitleTextColor: string;

        /**
         * Fundo do título das janelas de diálogo.
         */
        dialogTitleBackground: string;

        /**
         * Cor usada para compor o layout com linhas, formas, etc.
         */
        shapes: string;        
    }
}
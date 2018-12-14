namespace Skript.Business.Parts.Header {

    /**
     * Componente principal do módulo.
     */
    export class Controls extends Base {

        /**
         * Carrega e aplica os estilos css.
         */
        public css: string = `
            ${this.classNameSelector()} {
            }
        `;

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);            
        }
    }
}
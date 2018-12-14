namespace Skript.Framework.Layout.Components {
    
    /**
     * MoveAndResize: Configuração de inicialização.
     */
    export type MoveAndResizeConfiguration = { 

        /**
         * Componente responsável.
         * @type {React.Component}
         */
        owner: React.Component,

        /**
         * Elemento container.
         * @type {HTMLElement}
         */
        elContainer: HTMLElement,

        /**
         * Lista de elementos que iniciam a ação de mover.
         * @type {HTMLElement[]}
         */
        elMove: HTMLElement[]

        /**
         * Lista de elementos que iniciam a ação de redimensionar.
         * @type {HTMLElement[]}
         */
        elResize: HTMLElement[]

        /**
         * Retorna true para indicar que o container não precisa ser movido para frente ao mover.
         * @type {(evt: any) => void}
         */
        ignoreBringToFront?: (evt: any) => boolean,

        /**
         * Retorna true para indicar que qualquer ação de mover ou redimensionar deve ser ignorada.
         * @type {(evt: any) => void}
         */
        ignoreEventClick?: (evt: any) => void,

        /**
         * Função chamada sempre que redimensionar.
         * @type {() => void}
         */
        onResize?: () => void
    }
}

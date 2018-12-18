namespace Skript.Business.Parts.LuckygamesAdjusts {

    /**
     * Props para este componente.
     */
    export class AdjustsProps extends Framework.Layout.Components.EmptyProps {
        
        /**
         * Título.
         * @type {string}
         */
        title?: string;

        /**
         * Evento ao alterar seleção.
         * @type {(options: Framework.Types.KeyValue<Framework.Types.KeyValue<string, boolean>[]>) => boolean|undefined}
         */
        onChange?: (options: Framework.Types.KeyValue<Framework.Types.KeyValue<string, boolean>[]>) => boolean|undefined;

        /**
         * Lista de opções
         * @type {Framework.Types.KeyValue<Framework.Types.KeyValue<string, boolean>[]>}
         */
        options?: Framework.Types.KeyValue<Framework.Types.KeyValue<string, boolean>[]>;

        /**
         * Indica se a seleção da opção desmarca as outras.
         * @type {boolean}
         */
        exclusive?: boolean;
    }
}

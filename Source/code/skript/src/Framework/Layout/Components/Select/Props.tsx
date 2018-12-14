namespace Skript.Framework.Layout.Components.Select {

    /**
     * Props padrão para este componentes React.
     */
    export class Props extends EmptyProps {

        /**
         * Texto placeholder.
         * @type {string}
         */
        placeholder?: string;

        /**
         * Permite cancelar a seleção.
         * @type {boolean}
         */
        allowClear?: boolean;

        /**
         * Aceita tags.
         * @type {boolean}
         */
        tags?: boolean;

        /**
         * Seleção múltipla
         * @type {boolean}
         */
        multiple?: boolean;

        /**
         * Evento para quando houver mudança de valores.
         * @param {Core.KeyValue[]} values Parâmetros selecionados.
         */
        onChange?: (values: Types.KeyValue<string>[]) => void;
    }
}

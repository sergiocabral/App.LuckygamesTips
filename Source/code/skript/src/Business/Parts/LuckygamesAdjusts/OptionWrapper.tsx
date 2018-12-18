namespace Skript.Business.Parts.LuckygamesAdjusts {

    /**
     * Dados relativos a opção.
     */
    export class OptionWrapper {

        /**
         * Construtor.
         * @param {Framework.Types.KeyValue<string, boolean>} option Opção.
         */
        public constructor(option: Framework.Types.KeyValue<string, boolean>) {
            this.option = option;
            this.checked = !!option.state;
        }

        /**
         * Opção.
         * @type {Framework.Types.KeyValue<string, boolean>}
         */
        option: Framework.Types.KeyValue<string, boolean>;

        /**
         * Indica se está selecionada.
         * @type {boolean}
         */
        checked: boolean;
    }
}

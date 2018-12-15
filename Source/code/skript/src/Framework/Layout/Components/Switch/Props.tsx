namespace Skript.Framework.Layout.Components.Switch {

    /**
     * Props padrão para este componentes React.
     */
    export class Props extends EmptyProps {

        /**
         * Estado do controle.
         * @type {boolean}
         */
        checked?: boolean;

        /**
         * Class CSS todos Switch que fazem parte de uma conjunto radio.
         * @type {string}
         */
        radio?: string;

        /**
         * Valor.
         * @type {any}
         */
        value?: any;

        /**
         * Evento ao marcar.
         * @param {string} value Valor selecionador.
         * @param {boolean} checked Marcado ou não.
         * @param {any} evt Informações do evento.
         * @returns {boolean} Um retorno ===false desfaz a alteração.
         */
        onChange?: (value: string, checked: boolean, evt: any) => boolean|void;
    }
}

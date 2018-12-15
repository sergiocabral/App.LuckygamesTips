namespace Skript.Business.Parts.LogViewer {

    /**
     * Props do componente.
     */
    export class LevelsProps extends Framework.Layout.Components.EmptyProps {

        /**
         * Ao trocar a seleção.
         * @param {Framework.Log.Level[]} checkeds Valores atualmente selecionados.
         * @param {Framework.Log.Level[]} uncheckeds Valores atualmente não selecionados.
         */
        onChange?: (checkeds: Framework.Log.Level[], uncheckeds: Framework.Log.Level[]) => void
    }
}
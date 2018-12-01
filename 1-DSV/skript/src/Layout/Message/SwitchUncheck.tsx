namespace Skript.Layout.Message {

    /**
     * Desmarca Switch que fazem parte de um grupo radiobutton
     */
    export class SwitchUncheck extends Core.Bus.Message {

        public constructor(radio: string, instance?: ReactJs.Component.Switch) {
            super();
            this.radio = radio;
            this.instance = instance;
        }

        public instance?: ReactJs.Component.Switch;

        public radio: string;
    }
}
namespace Skript.Business.Layout {

    /**
     * Ajusta o css dos componentes do sistema.
     */
    export class Stylesheet {

        /**
         * Construtor.
         * @param {Theme} theme Agrupa ações sobre o visual css do sistema.
         */
        public constructor(public theme: Theme) {
            this.forAll();
        }

        /**
         * Aplica todos os estilos .
         */
        public forAll(): void {
            this.forGeneralUse();
            this.forAnchors();
            this.forTables();
            this.forTexts();
            this.forTitleLine();
            this.forButtonShadow();
            this.forButtons();
            this.forComponentDialog();
        }

        /**
         * Aplica os estilos para: Dialog.
         */
        public forComponentDialog(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className} .${Framework.Layout.Components.Base.getClassName(Framework.Layout.Components.Dialog.Dialog)}`;
            Framework.Util.DOM.stylesheet(`
                .${Core.Main.instance.presentation.configuration.className} > *:last-child > .${Framework.Layout.Components.Base.getClassName(Framework.Layout.Components.Dialog.Dialog)} > .dialog-header > div {
                }
                ${selector} > .dialog-header {
                    background-color: ${this.theme.dialogTitleBackgroundColor};
                    border-bottom-color: ${Framework.Util.Drawing.blend(0.5, this.theme.dialogTitleTextColor)};
                    text-shadow: 0 0 5px ${Framework.Util.Drawing.blend(0.9, this.theme.dialogTitleBackgroundColor)};
                }
                ${selector} > .dialog-header h1 {
                    color: ${this.theme.dialogTitleTextColor};
                    font-family: ${this.theme.dialogTextFont};
                    margin-top: 0;
                    margin-bottom: 0;
                }
                ${selector} > .dialog-header .graph {
                    color: ${this.theme.dialogTitleTextColor};
                    margin-top: -4px;
                }
                ${selector} > .dialog-header .button.dialog-action {
                    margin-top: -4px;
                }
                ${selector} > .dialog-header a.dialog-action {
                    color: ${Framework.Util.Drawing.blend(0.10, this.theme.dialogTitleTextColor)};
                }
                ${selector} > .dialog-header a.dialog-action:hover {
                    color: ${Framework.Util.Drawing.blend(-0.10, this.theme.dialogTitleTextColor)};
                }
                ${selector} > .dialog-resize {
                    background-color: ${Framework.Util.Drawing.blend(0.2, this.theme.dialogTitleBackgroundColor)};
                    border-top-color: ${Framework.Util.Drawing.blend(0.5, this.theme.dialogTitleTextColor)};
                }
                ${selector} > .dialog-header,
                ${selector} > .dialog-resize {
                    background-image: url("${this.theme.url}/dialog-background.png");
                    background-size: cover;
                    background-position: 0 0;
                }
            `);
        }

        /**
         * Aplica os estilos para: Uso geral.
         */
        public forGeneralUse(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className}`;
            Framework.Util.DOM.stylesheet(`
                ${selector} .width100 { width: 100%; }
                ${selector} .width90 { width: 90%; }
                ${selector} .width80 { width: 80%; }
                ${selector} .width70 { width: 70%; }
                ${selector} .width60 { width: 60%; }
                ${selector} .width50 { width: 50%; }
                ${selector} .width40 { width: 40%; }
                ${selector} .width30 { width: 30%; }
                ${selector} .width20 { width: 20%; }
                ${selector} .width10 { width: 10%; }
                ${selector} .spacing { display: block; height: ${this.theme.spacing}px; }
                ${selector} .alignLeft { text-align: left; }
                ${selector} .alignCenter { text-align: center; }
                ${selector} .alignRight { text-align: right; }
                ${selector} .valignTop { vertical-align: top; }
                ${selector} .valignMiddle { vertical-align: middle; }
                ${selector} .valignBottom { vertical-align: bottom; }
                ${selector} .nowrap { white-space: nowrap; }
            `);
        }

        /**
         * Aplica os estilos para: Linha divisória em titulos.
         */
        public forTitleLine(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className}`;
            Framework.Util.DOM.stylesheet(`
                ${selector} .line {
                    display: table;
                    position: relative;
                    overflow: hidden;
                    width: calc(100% - 10px);
                }
                ${selector} .line:after { 
                    content: " ";
                    position: absolute;
                    width: 99999px;
                    display: inline-block;
                    border-bottom: 7px dotted;
                    margin-top: 0.5em;
                    margin-left: 10px;
                    opacity: 0.15;
                }
            `);
        }

        /**
         * Aplica os estilos para: Tabelas.
         */
        public forTables(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className}`;
            Framework.Util.DOM.stylesheet(`
                ${selector} table th { vertical-align: middle; }
                ${selector} table td { vertical-align: top; }
            `);
        }

        /**
         * Aplica os estilos para: Textos <p>, <h1>, <h2>, etc.
         */
        public forTexts(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className}`;
            Framework.Util.DOM.stylesheet(`
                ${selector} p, h1, h2, h3, h4, h5, h6 {
                    margin: 0;
                    padding: 0;                    
                    font-size: 100%;
                }
                ${selector} h1, h2, h3, h4, h5, h6 {
                    font-family: 'Raleway', sans-serif;
                }
                ${selector} h1 { font-size: 120%; }
                ${selector} h2 { font-size: 110%; }
                ${selector} h3 { font-size: 100%; }
                ${selector} h4 { font-size: 90%; }
                ${selector} h5 { font-size: 80%; }
                ${selector} h6 { font-size: 70%; }
            `);
        }

        /**
         * Aplica os estilos para: Anchors <a>.
         */
        public forAnchors(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className}`;
            Framework.Util.DOM.stylesheet(`
                ${selector} a:not(.no-underline),
                ${selector} .anchor:not(.no-underline) {
                    border-bottom: 1px dotted;
                    padding-bottom: 2px;                    
                }
                ${selector} a,
                ${selector} .anchor {
                    color: ${Framework.Util.Drawing.blend(0.2, this.theme.generalTextColor)};
                    cursor: pointer;
                    transition: all 0.3s ease-out;
                }
                ${selector} a:hover,
                ${selector} .anchor:hover {
                    color: ${Framework.Util.Drawing.blend(-0.5, this.theme.generalTextColor)};
                }
            `);
        }

        /**
         * Aplica os estilos para: Button Shadow
         */
        public forButtonShadow(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className}`;
            Framework.Util.DOM.stylesheet(`
                ${selector} .button-shadow {
                    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
                    position: relative;
                }
                ${selector} .button-shadow:hover {
                    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
                }
                ${selector} .button-shadow:active {
                    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
                    border-top: 1px solid transparent;
                    top: 1px;
                }
                ${selector} .text-shadow {
                    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
                    position: relative;
                    border: 0 !important;                    
                    margin: 0 ${this.theme.spacing / 2}px;
                    opacity: 0.75;
                }
                ${selector} .text-shadow:hover {
                    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
                    opacity: 1;
                }
                ${selector} .text-shadow:active {
                    text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
                    border-top: 1px solid transparent;
                    top: 1px;
                }
            `);
        }

        /**
         * Aplica os estilos para: Buttons.
         */
        public forButtons(): void {
            const selector = `.${Core.Main.instance.presentation.configuration.className}`;
            Framework.Util.DOM.stylesheet(`
                ${selector} .button::-moz-focus-inner {
                    border: 0;
                    padding: 0;
                }              
                ${selector} .button {
                    display: inline-block;
                    *display: inline;
                    zoom: 1;
                    padding: 5px 10px;
                    margin: 0;
                    cursor: pointer;
                    border: 1px solid #bbb;
                    overflow: visible;
                    font: bold 13px arial, helvetica, sans-serif;
                    text-decoration: none;
                    white-space: nowrap;
                    color: #555;
                    background-color: #ddd;
                    background-image: linear-gradient(rgba(255,255,255,1), rgba(255,255,255,0));
                    transition: background-color .2s ease-out;
                    background-clip: padding-box; /* Fix bleeding */
                    border-radius: 3px;
                    box-shadow: 0 1px 0 rgba(0, 0, 0, .3), 0 1px 1px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;
                    text-shadow: 0 1px 0 rgba(255,255,255, .9);
                    user-select: none;
                }              
                ${selector} .button:hover {
                    background-color: #eee;
                }
                ${selector} .button:active {
                    background: #e9e9e9;
                    position: relative;
                    top: 1px;
                    text-shadow: none;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, .3) inset;
                }              
                ${selector} .button[disabled], .button[disabled]:hover, .button[disabled]:active {
                    border-color: #eaeaea;
                    background: #fafafa;
                    cursor: default;
                    position: static;
                    color: #999;
                    /* Usually, !important should be avoided but here it's really needed :) */
                    box-shadow: none !important;
                    text-shadow: none !important;
                }              
                /* Smaller buttons styles */              
                ${selector} .button.small {
                    padding: 4px 12px;
                }              
                /* Larger buttons styles */              
                ${selector} .button.large {
                    padding: 12px 30px;
                    text-transform: uppercase;
                }              
                ${selector} .button.large:active {
                    top: 2px;
                }              
                /* Colored buttons styles */              
                ${selector} .button.green, .button.red, .button.blue {
                    color: #fff;
                    text-shadow: 0 1px 0 rgba(0,0,0,.2);                    
                    background-image: linear-gradient(rgba(255,255,255,.3), rgba(255,255,255,0));
                }              
                /* */              
                ${selector} .button.green {
                    background-color: #57a957;
                    border-color: #57a957;
                }              
                ${selector} .button.green:hover {
                    background-color: #62c462;
                }              
                ${selector} .button.green:active {
                    background: #57a957;
                }              
                /* */              
                ${selector} .button.red {
                    background-color: #ca3535;
                    border-color: #c43c35;
                }              
                ${selector} .button.red:hover {
                    background-color: #ee5f5b;
                }              
                ${selector} .button.red:active {
                    background: #c43c35;
                }              
                /* */              
                ${selector} .button.blue {
                    background-color: #269CE9;
                    border-color: #269CE9;
                }              
                ${selector} .button.blue:hover {
                    background-color: #70B9E8;
                }              
                ${selector} .button.blue:active {
                    background: #269CE9;
                }              
                /* */              
                ${selector} .button.green[disabled], .button.green[disabled]:hover, .button.green[disabled]:active {
                    border-color: #57A957;
                    background: #57A957;
                    color: #D2FFD2;
                }              
                ${selector} .button.red[disabled], .button.red[disabled]:hover, .button.red[disabled]:active {
                    border-color: #C43C35;
                    background: #C43C35;
                    color: #FFD3D3;
                }              
                ${selector} .button.blue[disabled], .button.blue[disabled]:hover, .button.blue[disabled]:active {
                    border-color: #269CE9;
                    background: #269CE9;
                    color: #93D5FF;
                }                
                /* Group buttons */              
                ${selector} .button-group,
                ${selector} .button-group li {
                    display: inline-block;
                    zoom: 1;
                }                
                ${selector} .button-group {
                    font-size: 0; /* Inline block elements gap - fix */
                    margin: 0;
                    padding: 0;
                    background: rgba(0, 0, 0, .1);
                    border-bottom: 1px solid rgba(0, 0, 0, .1);
                    padding: 7px;
                    border-radius: 7px;
                }              
                ${selector} .button-group li {
                    margin-right: -1px; /* Overlap each right button border */
                }              
                ${selector} .button-group .button {
                    font-size: 13px; /* Set the font size, different from inherited 0 */
                    border-radius: 0;
                }                
                ${selector} .button-group .button:active {
                    box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                }              
                ${selector} .button-group li:first-child .button {
                    border-radius: 3px 0 0 3px;
                }              
                ${selector} .button-group li:first-child .button:active {
                    box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                }                
                ${selector} .button-group li:last-child .button {
                    border-radius: 0 3px 3px 0;
                }                
                ${selector} .button-group li:last-child .button:active {
                    box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                }
            `);
        }
    }
}

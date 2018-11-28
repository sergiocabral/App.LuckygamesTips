namespace Skript.Layout.Theme {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Conjuntos de propriedades de stylesheet que configuram o layout.
     */
    export class Stylesheet {

        /**
         * Construtor.
         * @param {Colors} colors Tema de cores para configurar o layout.
         */
        public constructor(colors: Colors = skript.data.colors) {
            skript.stylesheet = skript.stylesheet ? skript.stylesheet : this;

            this.colors = colors;
            this.zIndex = 1000;
            this.generalTextFont = "'Hind Siliguri', sans-serif";
            this.generalTextColor = Util.Drawing.blend(-0.5, colors.primary);
            this.generalBackgroundColor = "#ffffff";
            this.dialogTextFont = "'Raleway', sans-serif";
            this.dialogTitleTextColor = Util.Drawing.blend(-0.5, colors.secondary);
            this.dialogTitleBackgroundColor = Util.Drawing.blend(0.5, colors.secondary);

            this.generalStylesheet();
        }

        /**
         * Tema de cores para configurar o layout.
         * @type {Colors}
         */
        public colors: Colors;

        /**
         * Altura z-index mínima do layout do sistema.
         * @type {number}
         */
        public zIndex: number;

        /**
         * Fonte de texto em geral.
         * @type {string}
         */
        public generalTextFont: string;

        /**
         * Cor de texto em geral.
         * @type {string}
         */
        public generalTextColor: string;

        /**
         * Fundo em geral.
         * @type {string}
         */
        public generalBackgroundColor: string;

        /**
         * Fonte de texto do título das janelas de diálogo.
         * @type {string}
         */
        public dialogTextFont: string;

        /**
         * Cor do texto do título das janelas de diálogo.
         * @type {string}
         */
        public dialogTitleTextColor: string;

        /**
         * Fundo do título das janelas de diálogo.
         * @type {string}
         */
        public dialogTitleBackgroundColor: string;

        /**
         * Cores padrão para o tema.
         */
        public static getColorsDefault(): Colors {
            return {
                primary: "#007bff",
                secondary: "#6c757d",
                positive: "#28a745",
                negative: "#dc3545"
            };
        }

        /**
         * Nome descritivo do sistema
         * @type {string}
         */
        public title: string = skript.configuration.name;

        /**
         * Url do servidor.
         * @type {string}
         */
        public url: string = skript.configuration.server;
        
        /**
         * Define classes CSS de uso geral.
         */
        public generalStylesheet(): void {
            const selector = `.${Presentation.className}`;
            const styles: string[] = [];
            
            //Classes de uso geral
            styles.push(`
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
                ${selector} .alignLeft { text-align: left; }
                ${selector} .alignCenter { text-align: center; }
                ${selector} .alignRight { text-align: right; }
                ${selector} .valignTop { vertical-align: top; }
                ${selector} .valignMiddle { vertical-align: middle; }
                ${selector} .valignBottom { vertical-align: bottom; }
                ${selector} .nowrap { white-space: nowrap; }
            `);

            //Elementos de tabela
            styles.push(`
                ${selector} table th { vertical-align: middle; }
                ${selector} table td { vertical-align: top; }
            `);

            //Elementos <h1>, <h2>, ...
            styles.push(`
                ${selector} h1 {
                    font-family: 'Raleway', sans-serif;
                    font-size: 100%;
                    margin: 0;
                    padding: 0;                    
                }
                ${selector} h1 { font-size: 124%; }
                ${selector} h2 { font-size: 118%; }
                ${selector} h3 { font-size: 112%; }
                ${selector} h4 { font-size: 108%; }
                ${selector} h5 { font-size: 104%; }
                ${selector} h6 { font-size: 100%; }
            `);
            
            //Elementos <a>
            styles.push(`
                ${selector} a:not(.no-underline),
                ${selector} .anchor:not(.no-underline) {
                    border-bottom: 1px dotted;
                    padding-bottom: 2px;                    
                }
                ${selector} a,
                ${selector} .anchor {
                    color: ${Util.Drawing.blend(0.2, this.generalTextColor)};
                    cursor: pointer;
                    transition: all 0.3s ease-out;
                }
                ${selector} a:hover,
                ${selector} .anchor:hover {
                    color: ${Util.Drawing.blend(-0.5, this.generalTextColor)};
                }
            `);
            
            //Elemento tipo botão para mostrar diferença quando o mouse passa por cima.
            styles.push(`
                ${selector} button:not(.no-shadow),
                ${selector} .shadow {
                    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.5);
                    position: relative;
                    top: 0;
                }
                ${selector} button:not(.no-shadow):hover,
                ${selector} .shadow:hover {
                    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.6);
                }
                ${selector} button:not(.no-shadow):active,
                ${selector} .shadow:active {
                    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
                    top: 1px;
                }
            `);

            styles.push(`
                ${selector} .centered {
                    margin:50px auto;
                    text-align:center;
                }
              
                ${selector} .button::-moz-focus-inner{
                    border: 0;
                    padding: 0;
                }
              
                ${selector} .button{
                    display: inline-block;
                    *display: inline;
                    zoom: 1;
                    padding: 6px 20px;
                    margin: 0;
                    cursor: pointer;
                    border: 1px solid #bbb;
                    overflow: visible;
                    font: bold 13px arial, helvetica, sans-serif;
                    text-decoration: none;
                    white-space: nowrap;
                    color: #555;
                    
                    background-color: #ddd;
                    background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,1)), to(rgba(255,255,255,0)));
                    background-image: -webkit-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
                    background-image: -moz-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
                    background-image: -ms-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
                    background-image: -o-linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
                    background-image: linear-gradient(top, rgba(255,255,255,1), rgba(255,255,255,0));
                    
                    -webkit-transition: background-color .2s ease-out;
                    -moz-transition: background-color .2s ease-out;
                    -ms-transition: background-color .2s ease-out;
                    -o-transition: background-color .2s ease-out;
                    transition: background-color .2s ease-out;
                    background-clip: padding-box; /* Fix bleeding */
                    -moz-border-radius: 3px;
                    -webkit-border-radius: 3px;
                    border-radius: 3px;
                    -moz-box-shadow: 0 1px 0 rgba(0, 0, 0, .3), 0 2px 2px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;
                    -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, .3), 0 2px 2px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;
                    box-shadow: 0 1px 0 rgba(0, 0, 0, .3), 0 2px 2px -1px rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .3) inset;
                    text-shadow: 0 1px 0 rgba(255,255,255, .9);
                    
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
              
                ${selector} .button:hover{
                    background-color: #eee;
                    color: #555;
                }
              
                ${selector} .button:active{
                    background: #e9e9e9;
                    position: relative;
                    top: 1px;
                    text-shadow: none;
                    -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, .3) inset;
                    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .3) inset;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, .3) inset;
                }
              
                ${selector} .button[disabled], .button[disabled]:hover, .button[disabled]:active{
                    border-color: #eaeaea;
                    background: #fafafa;
                    cursor: default;
                    position: static;
                    color: #999;
                    /* Usually, !important should be avoided but here it's really needed :) */
                    -moz-box-shadow: none !important;
                    -webkit-box-shadow: none !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                }
              
                /* Smaller buttons styles */
              
                ${selector} .button.small{
                    padding: 4px 12px;
                }
              
                /* Larger buttons styles */
              
                ${selector} .button.large{
                    padding: 12px 30px;
                    text-transform: uppercase;
                }
              
                ${selector} .button.large:active{
                    top: 2px;
                }
              
                /* Colored buttons styles */
              
                ${selector} .button.green, .button.red, .button.blue {
                    color: #fff;
                    text-shadow: 0 1px 0 rgba(0,0,0,.2);
                    
                    background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,.3)), to(rgba(255,255,255,0)));
                    background-image: -webkit-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
                    background-image: -moz-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
                    background-image: -ms-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
                    background-image: -o-linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
                    background-image: linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255,0));
                }
              
                /* */
              
                ${selector} .button.green{
                    background-color: #57a957;
                    border-color: #57a957;
                }
              
                ${selector} .button.green:hover{
                    background-color: #62c462;
                }
              
                ${selector} .button.green:active{
                    background: #57a957;
                }
              
                /* */
              
                ${selector} .button.red{
                    background-color: #ca3535;
                    border-color: #c43c35;
                }
              
                ${selector} .button.red:hover{
                    background-color: #ee5f5b;
                }
              
                ${selector} .button.red:active{
                    background: #c43c35;
                }
              
                /* */
              
                ${selector} .button.blue{
                    background-color: #269CE9;
                    border-color: #269CE9;
                }
              
                ${selector} .button.blue:hover{
                    background-color: #70B9E8;
                }
              
                ${selector} .button.blue:active{
                    background: #269CE9;
                }
              
                /* */
              
                ${selector} .green[disabled], .green[disabled]:hover, .green[disabled]:active{
                    border-color: #57A957;
                    background: #57A957;
                    color: #D2FFD2;
                }
              
                ${selector} .red[disabled], .red[disabled]:hover, .red[disabled]:active{
                    border-color: #C43C35;
                    background: #C43C35;
                    color: #FFD3D3;
                }
              
                ${selector} .blue[disabled], .blue[disabled]:hover, .blue[disabled]:active{
                    border-color: #269CE9;
                    background: #269CE9;
                    color: #93D5FF;
                }
                
                /* Group buttons */
              
                ${selector} .button-group,
                ${selector} .button-group li{
                    display: inline-block;
                    *display: inline;
                    zoom: 1;
                }
                
                ${selector} .button-group{
                    font-size: 0; /* Inline block elements gap - fix */
                    margin: 0;
                    padding: 0;
                    background: rgba(0, 0, 0, .1);
                    border-bottom: 1px solid rgba(0, 0, 0, .1);
                    padding: 7px;
                    -moz-border-radius: 7px;
                    -webkit-border-radius: 7px;
                    border-radius: 7px;
                }
              
                ${selector} .button-group li{
                    margin-right: -1px; /* Overlap each right button border */
                }
              
                ${selector} .button-group .button{
                    font-size: 13px; /* Set the font size, different from inherited 0 */
                    -moz-border-radius: 0;
                    -webkit-border-radius: 0;
                    border-radius: 0;
                }
                
                ${selector} .button-group .button:active{
                    -moz-box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                    -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                    box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                }
              
                ${selector} .button-group li:first-child .button{
                    -moz-border-radius: 3px 0 0 3px;
                    -webkit-border-radius: 3px 0 0 3px;
                    border-radius: 3px 0 0 3px;
                }
              
                ${selector} .button-group li:first-child .button:active{
                    -moz-box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                    -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                    box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, -5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                }
                
                ${selector} .button-group li:last-child .button{
                    -moz-border-radius: 0 3px 3px 0;
                    -webkit-border-radius: 0 3px 3px 0;
                    border-radius: 0 3px 3px 0;
                }
                
                ${selector} .button-group li:last-child .button:active{
                    -moz-box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                    -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                    box-shadow: 0 0 1px rgba(0, 0, 0, .2) inset, 5px 0 5px -3px rgba(0, 0, 0, .2) inset;
                }
              `);

            Util.DOM.stylesheetCode(styles.join(""));
        }

        /**
         * Valida uma string para retorna como objeto.
         * @param {string} json Dados do json como string.
         * @returns {Translate[]} Objeto.
         */
        public static parse(json: string): Colors {
            if (!json || !eval(`!!${json};`)) throw new Core.Errors.NullNotExpected("parse(JSON)");
            return JSON.parse(json) as Colors;
        }
    }
}
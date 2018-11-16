namespace Util {

    /**
     * Utilitários envolvendo desenho, cores, etc.
     */
    export class Drawing {

        /**
         * Verifica se uma cor é mais clara do que escura.
         * @param {string} hexColor Cor hexadecimal.
         * @returns {boolean} Retorna true para cor clara e false para cor escura.
         */
        public static isLight(hexColor: string): boolean {
            let hex = hexColor.replace('#', '');
            hex = hex.length !== 6 ? hex : hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2);

            const c_r = parseInt(hex.substr(0, 2), 16);
            const c_g = parseInt(hex.substr(2, 2), 16);
            const c_b = parseInt(hex.substr(4, 2), 16);

            const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
            
            return brightness > 155;
        }

        /**
         * Aumenta ou diminui a claridade de uma cor.
         * @param {string} hexColor Cor hexadecimal.
         * @param {number} intensity Valor positivo clareia, negativo escurece.
         */
        public LightenDarken(hexColor: string, intensity: number): string {
            let hex = hexColor.replace('#', '');
            hex = hex.length !== 6 ? hex : hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2);
         
            var num = parseInt(hex, 16);         
            
            var r = (num >> 16) + intensity;         
            if (r > 255) r = 255;
            else if  (r < 0) r = 0;
         
            var b = ((num >> 8) & 0x00FF) + intensity;         
            if (b > 255) b = 255;
            else if  (b < 0) b = 0;
         
            var g = (num & 0x0000FF) + intensity;         
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
         
            hex = (hexColor.indexOf("#") >= 0 ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
            return hex;
        }
    }
}
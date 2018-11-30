namespace Skript.Part.User.LuckygamesAdjusts.Component {

    class AdjustsProps extends Layout.ReactJs.EmptyProps {
        
        title?: string;

        onChange?: (adjust: Core.KeyValue<any>, value: Core.KeyValue<any>) => void;

        options?: Core.KeyValue<Core.KeyValue<string>[]>;
    }

    /**
     * Componente principal do módulo.
     */
    export class Adjusts extends Layout.ReactJs.DialogComponentBase<AdjustsProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);            
        }
        
        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {         
            return (
                <div id={this.id()} className={this.className()}>
                    Ops
                </div>
            );
        }
    }
}
// Atualizações de dados
// > Recebimento de informações globais da luckygames.io, como All Bets, High Rollers, Rare Wins, Bets Made, Total Won, etc.
// > Desativar aumenta a performance por reduzir o consumo de banda de internet
// * Frequência normal
// * Frequência reduzida
// * Desligado

// Animações
// > Efeitos áudio visuais na atualização do saldo. Exibição do LuckyNumber tipo roleta giratória.
// > Desativar aumenta a performance por reduzir o consumo de processador e memória do seu computador.
// * Ligado
// * Desligado

// Visual
// > Layout com visual claro ou escuro do site luckygames.io.
// > É uma escolha meramente pessoal. Não interfere na performance.
// * Claro
// * Escuro

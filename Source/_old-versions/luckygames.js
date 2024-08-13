$('#header').css('display', 'none');
$('#news').css('display', 'none');
$('#main').css('padding', '0px');
$('#gameContainer').html('<div id="chart"></div>');
$('#gameContainer').css('width', '1050px');
$('#gameContainer').css('height', '300px');
$('#gameContainer').css('margin', 'auto');
$('#gameContainer').css('padding', '10px');
$('#chart').width('100%');
$('.btn.gray:hover').css('color', '#545454');
$('.btn.gray').css('color', '#949494');
$('.btn.gray').css('float', 'right');
$('.inputBox .label, .textBox .label, .selectBox .label').css('color', '#ffffff');
$('.inputBox input, .textBox .textarea, .textBox textarea, .radioBox input[type=text]').css('background', '#ffffff');
$('.inputBox input, .textBox .textarea, .textBox textarea, .radioBox input[type=text]').css('border', '1px #ffffff solid');
$('.inputBox .label, .textBox .label, .selectBox .label').css('color', '#ffffff');
$('.betContainer').html(
    '<div style="text-align: center;">' +
        '<div class="inputBox">' +
            '<div style="text-align: right;">Valor da aposta: <input type="number" id="betAmount" value="0.00000006" style="color: #fff; text-align: center; width: 60%;"></div>' +
            '<div style="text-align: right;">Alvo de ganho: <input type="number" id="profitTarget" value="0.00000000" style="color: #fff; text-align: center; width: 60%;"></div>' +
            '<div style="text-align: right;">Limite de perda: <input type="number" id="lossLimit" value="0.00000000" style="color: #fff; text-align: center; width: 60%;"></div>' +
            '<button class="btn green" id="startBot" style="width: 49%; float: none;" onclick="startBot();">Iniciar</button> ' +
            '<button class="btn red" id="stopBot" style="width: 49%; float: none;" onclick="stopBot();">Parar</button> ' +
            '<button class="btn" style="width: 49%; background-color: orangered; float: none;" onclick="startBotAgressive();">Mais agressivo</button> ' +
            '<button class="btn white" style="width: 49%; background-color: silver; float: none;" onclick="setVars()">Reiniciar</button>' +
            '<div style="text-align: left; margin-top: 0.3em; font-size: 0.85em" id="static">' +
                '<div>Tempo corrido: <span id="time">0:0:0:0</span>, Velocidade: <span id="speed">0.00</span></div>' +
                '<div>Ganhos: <span id="profit">0.00000000</span>, Perdas: <span id="balancelose">0</span></div>' +
                '<div>Apostas: <span id="bet">0</span>, Maior: <span id="largestbetAmount">0.00000000</span>, Total: <span id="wagered">0.00000000</span><div>' +
                '<div>Apostas ganhas: <span id="win">0</span>, perdidas: <span id="lose">0</span></div>' +
                '<div>Sequ&ecirc;ncia de vit&oacute;rias: <span id="winStreak">0</span>, de perdas: <span id="loseStreak">0</span></div>' +
                '<div>Sequ&ecirc;ncias m&aacute;xima de vit&oacute;rias: <span id="maxWinStreak">0</span>, perdas: <span id="maxLoseStreak">0</span></div>' +
            '</div>' +
        '</div>' +
    '</div>'
);
$('.betContainer').css('font-size', '16px');
$('.betContainer').css('color', '#fff');
$('.coin').css('background', 'none');
$('.inputBox input').css('background', 'none');
$('.inputBox input').css('border', '1px solid white');
$('.inputBox input').css('-webkit-box-shadow', 'none');
$('#coinSearch').css('background', 'none');
$('#coinSearch').css('border', '1px solid white');
$('#coinSearch').css('-webkit-box-shadow', 'none');
$('#listContainer').css('display', 'none');
$('#frontText').css('display', 'none');
$('#footer').css('display', 'none');
$('#log').css('background', 'none');
$('#log').css('overflow', 'auto');
$('#log').css('width', '38%');
$('#log').css('height', '293px');
$('#log').css('text-align', 'center');
$('#log').css('float', 'right');
$('#log').css('color', '#fff');
$('#log').css('font-size', '14px');
$('#log').css('border', '1px solid white');
$('#log').css('border-top-left-radius', '3px');
$('#log').css('border-bottom-left-radius', '3px');
$('div[class="tab tab-show"]:nth-child(4)').css('display', 'none');
log('BOT aplicado.');

let startbalance = parseFloat($('#balance').val());
let onBalance = 0;
let basebetAmount = parseFloat($('#betAmount').val());
let betAmount = basebetAmount;
let largestbetAmount = 0;
let largesBalance = startbalance;
let direction = (Math.floor(Math.random() * 100) + 1) % 2 === 0 ? 'over' : 'under';
let prediction = defaultChange();
let wagered = 0;
let profit = 0;
let largestProfit = 0;
let underBalance = 0;
let overBalance = 0;
let bet = 0;
let win = 0;
let winStreak = 0;
let maxWinStreak = 0;
let lose = 0;
let loseStreak = 0;
let maxLoseStreak = 0;
let run = false;
let runBet = 0;
let runLog = 0;
let dps = [];
let chart;
let color = '';
let time = '0:0:0:0';
let startTime = 0;
let onTime = 0;
let playTime = 0;
let playDay = 0;
let playHour = 0;
let playMinute = 0;
let playSecond = 0;
let chanceGo = { min: 10, max: 80 };
let listGameGo = [];
let balancelose = 0;
let golandau = 0;
let flagGo = false;
let flagNormal = false;
let getBackPrice = 5;
let currentBackPrice = getBackPrice;
let speed = 0;

function setVars() {
    startbalance = parseFloat($('#balance').val());
    basebetAmount = parseFloat($('#betAmount').val());
    betAmount = basebetAmount;
    largestbetAmount = 0;
    wagered = 0;
    profit = 0;
    largestProfit = 0;
    underBalance = 0;
    overBalance = 0;
    win = 0;
    winStreak = 0;
    maxWinStreak = 0;
    lose = 0;
    loseStreak = 0;
    maxLoseStreak = 0;
    speed = 0;
}

function getPayout(chance) {
    let payout = (100 / parseFloat(chance));
    payout = payout - (payout * (parseFloat(1) / 100));
    let value = parseFloat(payout);
    if (value < 1000)
        value = value.toFixed(4);
    return value;
}

function createChange() {
    for (let i = chanceGo.min; i <= chanceGo.max; i += 1) {
        let getPayoutForMulti = getPayout(i);
        listGameGo.push({
            hi: {
                game: parseFloat((100 - i - 0.01)).toFixed(0),
                risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                change: i.toFixed(0),
                lose: 0,
                direction: 'over',
                tilethang: 0,
                onlose: 1 / (1 * getPayoutForMulti - 1) * 120
            },
            low: {
                game: parseFloat(i).toFixed(2),
                risk: getPayoutForMulti * 10 + ((getPayoutForMulti * 10) * 20 / 100),
                change: i.toFixed(0),
                lose: 0,
                direction: 'under',
                tilethang: 0,
                onlose: 1 / (1 * getPayoutForMulti - 1) * 120
            }
        });
    }
}
createChange();

function updateTiLeThang(roll_number) {
    listGameGo.forEach(function(item) {
        if (roll_number < item.hi.game) {
            item.hi.lose += 1;
        } else {
            item.hi.lose = 0;
        }
        if (roll_number > item.low.game) {
            item.low.lose += 1;
        } else {
            item.low.lose = 0;
        }
        ['hi', 'low'].forEach(function(condition) {
            item[condition].tilethang = item[condition].lose / item[condition].risk * 100;
        });
    });
}

function resetTileThang() {
    listGameGo.forEach(function(item) {
        ['hi', 'low'].forEach(function(condition) {
            item[condition].tilethang = 0;
        });
    });
}

function getGoChange() {
    let infobet = {};
    let phantram = 0;
    listGameGo.forEach(function(item) {
        ['hi', 'low'].forEach(function(condition) {
            if (item[condition].tilethang >= 20 && item[condition].tilethang <= 25) {
                phantram = item[condition].tilethang;
                infobet.change = item[condition].change;
                infobet.direction = item[condition].direction;
                infobet.onlose = item[condition].onlose;
                infobet.tilethang = item[condition].tilethang;
            } else if (item[condition].tilethang >= 10 && item[condition].tilethang <= 20) {
                phantram = item[condition].tilethang;
                infobet.change = item[condition].change;
                infobet.direction = item[condition].direction;
                infobet.onlose = item[condition].onlose;
                infobet.tilethang = item[condition].tilethang;
            } else if (item[condition].tilethang >= phantram) {
                phantram = item[condition].tilethang;
                infobet.change = item[condition].change;
                infobet.direction = item[condition].direction;
                infobet.onlose = item[condition].onlose;
                infobet.tilethang = item[condition].tilethang;
            }
        });
    });
    return infobet;
}

function updateChange(gameStatus, amount_return) {
    if (golandau <= 0) {
        golandau = 1;
    }
    if (balancelose > 0) {
        balancelose = 0;
    }
    if (gameStatus === 'win') {
        if (balancelose < 0 && flagGo) {
            balancelose += parseFloat(amount_return);
            golandau++;
            if (golandau > 10) {
                golandau = 10;
            }
        }
    } else {
        balancelose += parseFloat(amount_return);
    }
    let goChance = getGoChange();
    if (balancelose < 0 && bet >= getBackPrice) {
        flagGo = true;
        flagNormal = false;
        let getPayoutGo = getPayout(goChance.change);
        if (goChance.tilethang >= 20 && goChance.tilethang <= 25) {
            if (Math.abs(balancelose) / largesBalance * 100 < 1) {
                betAmount = Math.abs(balancelose) / (getPayoutGo - 1);
            } else {
                betAmount = Math.abs(balancelose) / 100 / (getPayoutGo - 1)
            }
            prediction = goChance.change;
            direction = goChance.direction;
        } else if (goChance.tilethang >= 10 && goChance.tilethang <= 20) {
            getBackPrice = bet + currentBackPrice;
            betAmount = Math.abs(balancelose) / golandau / (getPayoutGo - 1);
            if (betAmount / onBalance * 100 > 10) {
                betAmount = 10 * onBalance / 100;
            }
            golandau--;
            prediction = 98 - goChance.change;
            direction = goChance.direction === 'over' ? 'under' : 'over';
        } else {
            betAmount = Math.abs(balancelose) / 100 / (getPayoutGo - 1);
            prediction = 98 - goChance.change;
            direction = goChance.direction === 'over' ? 'under' : 'over';
        }
    } else {
        flagGo = false;
        flagNormal = true;
        direction = (Math.floor(Math.random() * 100) + 1) % 2 === 0 ? 'over' : 'under';
        prediction = defaultChange();
        betAmount = basebetAmount;
    }
    if (betAmount < 0.00000001) {
        betAmount = basebetAmount;
    }
    if (betAmount > onBalance) {
        betAmount = onBalance / 2
    }
}
//original: //dicegametool.com/public/js/canvasjs.min.js
$.getScript('https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.js').done(function(script, textStatus) {
    dps = [/*{
        x: 0,
        y: 0
    } */];
    chart = new CanvasJS.Chart('chart', {
        theme: 'light2',
        zoomEnabled: true,
        height: 295,
        axisX: {
            title: "Total de rodadas",
            includeZero: false,
        },
        axisY: {
            title: "Perda/Ganho",
            includeZero: false,
        },
        title: {
            text: 'Rendimento das rodadas',
            fontSize: 16
        },
        data: [{
            type: 'stepLine',
            dataPoints: dps
        }]
    });
    chart.render();
});

function updateChart(bet, profit, color) {
    dps.push({
        x: bet,
        y: profit,
        color: color
    });
    if (dps[dps.length - 2]) {
        dps[dps.length - 2].lineColor = color;
    }
    if (dps.length > 1e3) {
        dps.shift();
    }
    chart.render();
}

function log(string) {
    $('<p style="text-align: center; margin: 0px;">' + string + '</p>').appendTo('#log');
}

function startBotAgressive() {
    if (!run) return;
    for (var i = 0; i < 5; i++) {
        setTimeout(runBot, 0 * 100);
    }
}

let clearChart = false;
function startBot() {
    if (run) return;
    run = true;
    startTime = new Date();
    if ($('#underBalance').val() === '') {
        underBalance = 0;
    } else {
        underBalance = $('#underBalance').val();
    }
    if ($('#overBalance').val() === '') {
        overBalance = 0;
    } else {
        overBalance = $('#overBalance').val();
    }
    basebetAmount = parseFloat($('#betAmount').val());
    betAmount = basebetAmount;
    startbalance = parseFloat($('#balance').val());
    largesBalance = startbalance;
    runBot();
}

function stopBot() {
    run = false;
}

function defaultChange() {
    return randomNumberFromRange(40, 66);
}

function randomNumberFromRange(min, max) {
    let rdChange = parseFloat(Math.random() * (max - min) + min).toFixed(0);
    if (rdChange === 0) {
        PlayGame.randomNumberFromRange(min, max);
    } else {
        return rdChange;
    }
}

function runBot() {
    if (run === true) {
        if (clearChart) {
            clearChart = false;
            dps.length = 0;
        }
        basebetAmount = parseFloat($('#betAmount').val());
        jQuery.ajax({
            url: '/ajx/',
            type: 'POST',
            dataType: 'html',
            cache: false,
            timeout: 2e4,
            data: {
                game: 'dice',
                coin: $('#coin').val(),
                betAmount: betAmount,
                prediction: prediction,
                direction: direction,
                clientSeed: $('#clientSeed').val(),
                serverSeedHash: $('#serverSeedHash').html(),
                action: 'playBet',
                hash: user.hash
            },
            success: function(data) {
                let a = JSON.parse(data);
                gameResult = a.gameResult;
                if (a.result === true) {
                    $('#serverSeedHash').html(a.serverSeedHash);
                    $('#prevServerSeed').html(a.prevServerSeed);
                    $('#prevServerSeedHash').html(a.prevServerSeedHash);
                    $('#prevClientSeed').html(a.prevClientSeed);
                    $('#balance').val(a.balance);
                    bet++;
                    wagered = parseFloat(wagered) + parseFloat(betAmount);
                    onBalance = parseFloat(a.balance);
                    if (onBalance > largesBalance) {
                        largesBalance = onBalance;
                    }
                    profit = onBalance - startbalance;
                    onTime = new Date().getTime();
                    playTime = onTime - startTime;
                    playDay = Math.floor(playTime / (1e3 * 60 * 60 * 24));
                    playHour = Math.floor((playTime % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60));
                    playMinute = Math.floor((playTime % (1e3 * 60 * 60)) / (1e3 * 60));
                    playSecond = Math.floor((playTime % (1e3 * 60)) / 1e3);
                    time = '' + playDay + ':' + playHour + ':' + playMinute + ':' + playSecond + '';
                    speed = parseFloat((bet / playTime) * 1e3);
                    if (gameResult === 'win') {
                        win++;
                        winStreak++;
                        loseStreak = 0;
                        color = '#2eab5b';
                    } else {
                        lose++;
                        loseStreak++;
                        winStreak = 0;
                        color = '#ab2e40';
                    }
                    if (winStreak >= maxWinStreak) {
                        maxWinStreak = winStreak;
                    }
                    if (loseStreak >= maxLoseStreak) {
                        maxLoseStreak = loseStreak;
                    }
                    if (betAmount >= largestbetAmount) {
                        largestbetAmount = betAmount;
                    }
                    if (profit >= largestProfit) {
                        largestProfit = profit;
                    }
                    runLog++;
                    if (runLog > 1e2) {
                        runLog = 0;
                        $('#log p').remove();
                    }
                    if (overBalance != 0 && onBalance >= overBalance) {
                        log('Acima do saldo!');
                    } else if (underBalance != 0 && onBalance <= underBalance) {
                        log('Abaixo do saldo!');
                    } else {
                        updateTiLeThang(a.resultNumber);
                        updateChange(gameResult, a.profit);
                    }
                    $('#time').html(time);
                    $('#speed').html(speed.toFixed(2));
                    $('#bet').html(bet);
                    $('#win').html(win);
                    $('#winStreak').html(winStreak);
                    $('#maxWinStreak').html(maxWinStreak);
                    $('#lose').html(lose);
                    $('#loseStreak').html(loseStreak);
                    $('#maxLoseStreak').html(maxLoseStreak);
                    $('#largestbetAmount').html(largestbetAmount.toFixed(8));
                    $('#profit').html(profit.toFixed(8));
                    $('#wagered').html(wagered.toFixed(8));
                    $('#balancelose').html(balancelose.toFixed(8));                    
                    //updateChart(bet, profit, color);
                    updateChart(bet, onBalance, color);

                    const currentValue = parseFloat($("#balance").val());
                    const profitTarget = parseFloat($('#profitTarget').val());
                    const lossLimit = parseFloat($('#lossLimit').val());
                    if ((profitTarget === 0 || isNaN(profitTarget) || currentValue < profitTarget) &&
                        (lossLimit === 0 || isNaN(lossLimit) || currentValue > lossLimit)) {
                        runBot();
                    }
                    else {
                        run = false;
                        if (run) {
                            if (profitTarget !== 0 && !isNaN(profitTarget) && currentValue >= profitTarget) {
                                (new Audio('http://debug.splitz.com.br/alerta-alta.ogg')).play();
                                setTimeout(function() { 
                                    alert('Limite de GANHO atingido: ' + profitTarget.toFixed(8) + '\nValor final: ' + currentValue.toFixed(8)); 
                                }, 1000);
                            }
                            else if (lossLimit !== 0 && !isNaN(lossLimit) && currentValue <= lossLimit) {
                                (new Audio('http://debug.splitz.com.br/alerta-baixa.ogg')).play();
                                setTimeout(function() { 
                                    alert('Limite de PERDA atingido: ' + lossLimit.toFixed(8) + '\nValor final: ' + currentValue.toFixed(8)); 
                                }, 1000);
                            }
                        }
                    }
                } else {
                    randomizeSeed();
                    setTimeout(runBot, 1000);
                }
            },
            error: function(xhr, ajaxOptions, throwagerednError) {
                randomizeSeed();
                setTimeout(runBot, 1000);
            },
            timeout: function(xhr, ajaxOptions, throwagerednError) {
                randomizeSeed();
                setTimeout(runBot, 1000);
            },
            abetort: function(xhr, ajaxOptions, throwagerednError) {
                randomizeSeed();
                setTimeout(runBot, 1000);
            }
        });
    } else {
        return;
    }
}

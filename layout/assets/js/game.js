var game = null;

var mouse = false;
var mousepos = 0;

var falsestart = true;

$(document).ready(() => setTimeout(() => startPage(), 250));

function startPage() {
    $('.screen').hide();
    $('.game-panel').hide();
    $(".forelayer").hide();
    setTimeout(function () {
        $('.screen-game').show()
        $("body").fadeIn();
        if (!falsestart) {
            $('.screen-game').addClass('blackout');
            setTimeout(function () {
                $('#instr').addClass('show').slideDown();
            }, 550);
        }
    }, 150);

    if (!falsestart) {
        $('button#next').click(function () {
            $('#instr').slideUp(400, function () {
                $('#instr').removeClass('show');
                $('#login').addClass('show');
                $('#login').slideDown();
            });
        });

        $('input#username').on('keyup', function () {
            if ($(this).val() == '')
                $('button#start').attr('disabled', 'disabled');
            else
                $('button#start').removeAttr('disabled');
        });

        $('button#start').click(function (e) {
            e.preventDefault();
            if ($('input#username').val() == '') {
                $(this).attr('disabled', 'disabled');
                return;
            }
            game = new Game($('input#username').val());
            game.start();
        });
    } else {
        game = new Game('Debug Mode');
        game.start();
    }
}

$('.screen-game').mousedown((event) => mousedown(event));

function restart() {
    $('body').fadeOut(400, () => location.reload());
}

function mousedown(e) {
    mouse = true;
    mousepos = e.pageX - $('.screen-game').offset().left;
    // console.log(mouse, mousepos);
}

$(".screen-game").mouseup(() => mousereset());

function mousereset() {
    mouse = false;
    mousepos = 0;
}

function isOverlap(idOne, idTwo) {
    let objOne = $(idOne),
        objTwo = $(idTwo),
        offsetOne = objOne.offset(),
        offsetTwo = objTwo.offset(),
        topOne = offsetOne.top,
        topTwo = offsetTwo.top,
        leftOne = offsetOne.left,
        leftTwo = offsetTwo.left,
        widthOne = objOne.width(),
        widthTwo = objTwo.width(),
        heightOne = objOne.height(),
        heightTwo = objTwo.height();
    let leftTop = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
        rightTop = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
        leftBottom = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne,
        rightBottom = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne;
    return leftTop || rightTop || leftBottom || rightBottom;
}

class Game {
    username;
    health = 3;
    top = 0;
    frames = 0;
    time = 20;
    timeToSpawnCar = 0;
    playerInvincible = true;

    constructor(username) {
        this.username = username;
    }

    start() {
        $('.user-info').html(this.username);
        $('#login').slideUp(400, function () {
            $('#login').removeClass('show');
            $('.screen-game').removeClass('blackout');
            $('.player').css({left: $('.screen-game').width() / 2});
            $('.player').css({bottom: -1 * $('.player').width() * 5});
            $('.game-panel').fadeIn();
            $(".forelayer").fadeIn(450, function () {
                $('.player').animate({bottom: 25}, 1000);
            });
        });
        this.updateTimer();
        requestAnimationFrame(() => this.update());
    }

    updateTimer = function () {
        if (this.timeToSpawnCar == 0) this.spawnCar();
        this.timeToSpawnCar--;
        if (this.time < 0) {
            this.time = 0;
            return;
        }
        $('.time').html((Math.floor(this.time / 60) < 10 ? "0" + Math.floor(this.time / 60) : Math.floor(this.time / 60)) + ":" + ((this.time % 60) < 10 ? "0" + this.time % 60 : this.time % 60));
        if(this.time == 18) this.playerInvincible = false;
    };

    stop = function () {
        $('.screen-game').addClass('blackout')
        $('.game-panel').fadeOut(400);
        $(".forelayer").fadeOut(400, () => $('.screen-ranking').slideDown());
        // $('.screen-ranking').addClass('show');
    };

    offsetPlayer = function (offset) {
        if (offset == 0) return;
        let playeroffset = $('.player').offset().left - $('.screen-game').offset().left;
        if ((offset > 0 && (playeroffset + offset >= $('.screen-game').width() - 360)) || (offset < 0 && (playeroffset + offset <= 270))) {
            mousereset();
            return;
        }

        $('.player').css({left: "+=" + offset + "px", transform: 'rotate(' + (offset < 0 ? '-' : '') + '15deg)'});

        if (offset < 0) $('.player img').attr('src', 'assets/img/player_left.png'); else $('.player img').attr('src', 'assets/img/player_right.png');

    };

    spawnCar = function () {
        this.timeToSpawnCar = 2;
        if ($('.normalcar').length > 4) return;
        let car = random(1, 3);
        let poses = [356, 496, 656, 796];
        let pos = random(0, 3);
        let newcar = $('.car' + car).clone().addClass('normalcar').css({
            left: poses[pos],
            bottom: $('.screen-game').width()
        });
        $('.carplace').append(newcar);
    };

    update = function () {
        this.frames++;
        $('.screen-game').css({backgroundPositionY: '+=10px'});
        $('.normalcar').css({bottom: "-=15px"});
        $('.normalcar').filter((i, el) => {
            return parseInt($(el).css('bottom')) < -1 * $(el).height() || i > 4;
        }).remove();
        $('.normalcar').each((i, el) => {
            let car = el;
            let player = $('.player').get()[0];
            // if (((car.offsetLeft < player.offsetLeft && car.offsetLeft + car.width() > player.offsetLeft) && (car.offsetTop < player.offsetTop && car.offsetTop + car.height() > player.offsetTop)) || ((car.offsetLeft < player.offsetLeft + player.width() && car.offsetLeft + car.width() > player.offsetLeft + player.width()) && (car.offsetTop < player.offsetTop + player.height() && car.offsetTop + car.height() > player.offsetTop + player.height()))) {

            if (isOverlap(car, player) && !this.playerInvincible) {
                this.time = 0;
                return;
            }
        });

        if (this.frames >= 60) {
            this.time--;
            this.updateTimer();
            this.frames = 0;
        }
        // console.log( mousepos, $('.player').position().left);
        /* if (mouse)
             $('.screen-game').mousedown();*/
        if (mouse)
            if ((mousepos <= $('.player').position().left + $('.player').width() / 2)) this.offsetPlayer(-10);
            else this.offsetPlayer(10);
        else {
            $('.player img').attr('src', 'assets/img/player.png');
            $('.player').css({transform: 'rotate(0deg)'});
        }

        if (this.time > 0) requestAnimationFrame(() => this.update()); else this.stop();
    };
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

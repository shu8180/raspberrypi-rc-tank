var ws = null;
var sendMes = [0, 0];
var url = "";

var ctl_hight = 300;
var title_hight = 50;

var _canvas_left;
var _context_left;
var motorPowerLeft = 0;
var touchFlagLeft = false;
var touchIdLeft = -1;
var touchIdLeftTmp = -1;
var sLeft = "";
var IndexLeft = -1;

var _canvas_right;
var _context_right;
var motorPowerRight = 0;
var touchFlagRight = false;
var touchIdRight = -1;
var touchIdRightTmp = -1;
var sRight = "";
var IndexRight = -1;

// 初期化...
window.addEventListener('load', function() {
    url = "ws://" + location.hostname + ":8080/pipe";
    ws = new WebSocket(url);

    // 左操作用Canvasの準備
    _canvas_left = document.getElementById('canvas-area-left');
    _canvas_left.width  = (document.documentElement.clientWidth / 2) - 10;
    _canvas_left.height = ctl_hight;
    _context_left = _canvas_left.getContext('2d');
    _context_left.fillStyle   = 'rgba(255, 255, 255, 1)';   // 塗りつぶし色を白に
    // 指が置かれたとき...
    _canvas_left.addEventListener('touchstart', touchstart_left, {passive: false}); 
    // 指が離れたとき...
    _canvas_left.addEventListener('touchend', touchend_left, {passive: false});
    // 指が動いたとき...
    _canvas_left.addEventListener('touchmove', touchmove_left, {passive: false});

    // 右操作用Canvasの準備
    _canvas_right = document.getElementById('canvas-area-right');
    _canvas_right.width  = (document.documentElement.clientWidth / 2) - 10;
    _canvas_right.height = ctl_hight;
    _context_right = _canvas_right.getContext('2d');
    _context_right.fillStyle   = 'rgba(255, 255, 255, 1)';   // 塗りつぶし色を白に
    // 指が置かれたとき...
    _canvas_right.addEventListener('touchstart', touchstart_right, {passive: false}); 
    // 指が離れたとき...
    _canvas_right.addEventListener('touchend', touchend_right, {passive: false});
    // 指が動いたとき...
    _canvas_right.addEventListener('touchmove', touchmove_right, {passive: false});

    ws.send(sendMes);
});


function touchstart_left(e) {
    e.preventDefault(); // スクロール防止
    for (var i = 0; i < e.changedTouches.length; ++i) {
        if(touchFlagLeft === false) {
            touchIdLeft = e.changedTouches[i].identifier;
            touchFlagLeft = true;
        }
    }
}
function touchend_left(e) {
    e.preventDefault(); // スクロール防止
    for (var i = 0; i < e.changedTouches.length; ++i) {
        if((touchFlagLeft === true) && 
           (touchIdLeft === e.changedTouches[i].identifier)) {
            touchIdLeft = -1;
            touchFlagLeft = false;
            motorPowerLeft = 0;
            sendMes[0] = motorPowerLeft;
            ws.send(sendMes);
        }
    }
}
function touchmove_left(e) {
    e.preventDefault(); // スクロール防止
    for (var i = 0; i < e.changedTouches.length; ++i) {
        if((touchFlagLeft === true) && 
           (touchIdLeft === i)) {
//           (touchIdLeft === e.changedTouches[i].identifier)) {
            touchIdLeftTmp = e.changedTouches[i].identifier;
            IndexLeft = i;
            sLeft = "";
            var t = e.touches[i];       // 触れている指に関する情報を取得
            sLeft += "Left [" + i + "]";
            sLeft += "x=" + Math.round(t.pageX) + ",";
            sLeft += "y=" + Math.round(t.pageY) + "<br>";
            motorPowerLeft = Math.round(((((Math.round(t.pageY) - title_hight) - (ctl_hight / 2)) * (-1)) / (ctl_hight / 2)) * 100);
            if(motorPowerLeft > 100){
                motorPowerLeft = 100;
            }else if(motorPowerLeft < -100) {
                motorPowerLeft = -100;
            }
            sendMes[0] = motorPowerLeft;
            ws.send(sendMes);
        }
    }
}


function touchstart_right(e) {
    e.preventDefault(); // スクロール防止
    for (var i = 0; i < e.changedTouches.length; ++i) {
        if(touchFlagRight === false) {
            touchIdRight = e.changedTouches[i].identifier;
            touchFlagRight = true;
        }
    }
}
function touchend_right(e) {
    e.preventDefault(); // スクロール防止
    for (var i = 0; i < e.changedTouches.length; ++i) {
        if((touchFlagRight === true) && 
           (touchIdRight === e.changedTouches[i].identifier)) {
            touchIdRight = -1;
            touchFlagRight = false;
            motorPowerRight = 0;
            sendMes[1] = motorPowerRight;
            ws.send(sendMes);
        }
    }
}
function touchmove_right(e) {
    e.preventDefault(); // スクロール防止
    for (var i = 0; i < e.changedTouches.length; ++i) {
        if((touchFlagRight === true) && 
           (touchIdRight === i)) {
//           (touchIdRight === e.changedTouches[i].identifier)) {
            touchIdRightTmp = e.changedTouches[i].identifier;
            IndexRight = i;
            sRight = "";
            var t = e.touches[i];       // 触れている指に関する情報を取得
            sRight += "Right [" + i + "]";
            sRight += "x=" + Math.round(t.pageX) + ",";
            sRight += "y=" + Math.round(t.pageY) + "<br>";
            motorPowerRight = Math.round(((((Math.round(t.pageY) - title_hight) - (ctl_hight / 2)) * (-1)) / (ctl_hight / 2)) * 100);
            if(motorPowerRight > 100){
                motorPowerRight = 100;
            }else if(motorPowerRight < -100) {
                motorPowerRight = -100;
            }
            sendMes[1] = motorPowerRight;
            ws.send(sendMes);
        }
    }
}

// タイマーの処理。50ミリ秒ごとに画像を更新
setInterval(function(){
    // 画像のオブジェクトを取得
    var s = "url=" + url + "<br>"
    s += sLeft + sRight;
    s += "touchIdLeft = " + touchIdLeft + ", touchFlagLeft = " + touchFlagLeft + ", touchIdLeftTmp =" + touchIdLeftTmp + ", IndexLeft = " + IndexLeft + ", motorPowerLeft = " + motorPowerLeft + "<br>";
    s += "touchIdRight = " + touchIdRight + ", touchFlagRitht = " + touchFlagRight + ", touchIdRightTmp =" + touchIdRightTmp + ", IndexRight = " + IndexRight + ", motorPowerRight = " + motorPowerRight + "<br>";
    document.getElementById("disp").innerHTML = s;  // 生成した文字列を画面に表示
}, 50);

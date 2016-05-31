function $(name) {
    return document.querySelector(name);
}

function Draw(wrap) {
    this.wrap = $(wrap);
    this.ctx = this.wrap.getContext('2d');
    this.tempArray = [];
    
    return this.init();
}
Draw.prototype = {
    init: function() {
        var rootObj=this;//利用一个变量中转指针对象
        if (!this.ctx) throw Error("初始化失败！");
        this.wrap.addEventListener('touchmove', function (e) {
            e.preventDefault();
            rootObj.drawing(e);
        });
        this.wrap.addEventListener('touchstart', function(e) {
            rootObj.tempArray = [];
            rootObj.tempArray.push({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            });
        });
        //绑定触摸事件
    },
    drawing: function(event) {
        var curPosition = {
            x: undefined,
            y: undefined
        };
        curPosition.x = parseInt(event.touches[0].clientX);
        curPosition.y = parseInt(event.touches[0].clientY);
        this.tempArray.push(curPosition);
        if (this.tempArray.length === 3) {
            this.tempArray.shift();

            //开始绘图
            with(this) {
                ctx.beginPath();
                ctx.moveTo(tempArray[0].x, tempArray[0].y);
                ctx.lineTo(tempArray[1].x, tempArray[1].y);
                ctx.stroke();
            }
        }
    },
    setWidth: function(width) {
        if (width) this.ctx.lineWidth = width;
    },
    setColor: function(color) {
        if (color) this.ctx.lineColor = color;
    }
}

function init() {
    var drawIt=new Draw();
    
}
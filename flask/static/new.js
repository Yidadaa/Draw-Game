function $(name) {
    return document.querySelector(name);
}

function Draw(wrap) {
    this.wrap = $(wrap);
    this.ctx = this.wrap.getContext('2d');
    this.tempArray = []; //缓存笔触
    this.historyPath = []; //历史路径

    this.lineWidth = screen.width * 0.005;
    this.lineColor = '#000';

    return this.init();
}
Draw.prototype = {
    init: function() {
        var self = this; //利用一个变量中转指针对象
        this.wrap.width = screen.width;
        this.wrap.height = screen.height * 0.5;
        this.setWidth(this.lineWidth);
        this.setColor(this.lineColor);
        $('html').style.fontSize = screen.height * 0.05 + 'px';
        //设置必要的默认参数，保证全平台一致
        if (!this.ctx) throw Error("初始化失败！");
        this.wrap.addEventListener('touchmove', function(e) {
            e.preventDefault();
            self.drawing(self.getBrushPos(e));
        });
        this.wrap.addEventListener('touchstart', function(e) {
            e.preventDefault();
            self.recordAction();
            self.tempArray = [];
            self.drawing(self.getBrushPos(e));
        });
        //绑定触摸事件
    },
    drawing: function(curPosition) {
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
        } else if (this.tempArray.length === 1 | this.tempArray.length === 2) {
            with(this) {
                ctx.beginPath();
                ctx.moveTo(tempArray[0].x, tempArray[0].y);
                ctx.lineTo(tempArray[0].x + parseInt(this.lineWidth), tempArray[0].y);
                if (this.tempArray.length === 2) {
                    ctx.lineTo(tempArray[1].x, tempArray[1].y);
                }
                ctx.stroke();
            }
        }
    },
    setWidth: function(width) {
        if (width) {
            this.ctx.lineWidth = width;
            this.lineWidth = width;
        }
    },
    setColor: function(color) {
        if (color) {
            this.ctx.strokeStyle = color;
            this.lineColor = color;
        }
    },
    clearAll: function() {
        this.ctx.clearRect(0, 0, this.wrap.width, this.wrap.height);
        this.tempArray = [];
        this.historyPath = [];
    },
    getBrushPos: function(event) {
        /**
         * 获取触摸事件的位置
         */
        var curPosition = {
            x: undefined,
            y: undefined
        };
        curPosition.x = parseInt(event.touches[0].clientX - this.wrap.offsetLeft);
        curPosition.y = parseInt(event.touches[0].clientY - this.wrap.offsetTop);

        return curPosition;
    },
    recordAction: function() {
        var img = new Image();
        img.src = this.wrap.toDataURL();
        this.historyPath.push(img);
    },
    cancelAction: function() {
        if (this.historyPath.length) {
            this.ctx.clearRect(0, 0, this.wrap.width, this.wrap.height);
            this.ctx.drawImage(this.historyPath.pop(), 0, 0, this.wrap.width, this.wrap.height);
        }
    }
}

function init() {
    var drawIt = new Draw('#paper');
    $('#clear-btn').addEventListener('click', function() {
        drawIt.clearAll();
    });
    $('#cancel-btn').addEventListener('click', function() {
        drawIt.cancelAction();
    })
    $('#tool-bar').addEventListener('click', function(e) {
        switch (e.target.id) {
            case 'set-lineWidth':
                {
                    $('#width-setter').style.display = 'block';
                    $('#colors').style.display = 'none';
                    break;
                }
            case 'set-lineColor':
                {
                    $('#width-setter').style.display = 'none';
                    $('#colors').style.display = 'block';
                    break;
                }
        }
    });
    $('#tool-bar').addEventListener('touchend', function(e) {
        if (e.target.id == 'width-setter') {
            var num = e.target.value / 120;
            drawIt.setWidth((num + 1) * screen.width * 0.005);
            $('#set-lineWidth').style.border = 0.4 * (1 - num) + "rem solid #eee";
        } else
        if (e.target.id.match('color*')) {
            var color = window.getComputedStyle(e.target).backgroundColor;
            drawIt.setColor(color);
            $('#set-lineColor').style.backgroundColor = color;
        }
    });

    var colors = ['#000000', '#FFCD00', '#F5001D', '#2DD700', '#624AD8'];
    $('#set-lineColor').style.backgroundColor = colors[0];
    for (var i in colors) {
        var node = document.createElement('button');
        node.className = 'list-btn color-btn';
        node.id = 'coloe' + i;
        node.style.backgroundColor = colors[i];
        $('#colors').appendChild(node);
    }
}
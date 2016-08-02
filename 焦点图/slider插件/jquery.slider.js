
/**
 * jquery.slider.js 1.0
 * http://passer-by.com
 */
;(function($, window, document, undefined) {
    var Slider = function(element,options){
        //ȫ�ֱ���
        var _ = this,
            _distance = [],         //��֡������ʼ֡λ��
            _size,                  //֡��
            _index,                 //��ǰѡ��֡
            _outer,                 //�������ߴ�
            _inner,                 //������ڳߴ�
            _start = {},            //�����������:pageX������,pageY������
            _position = [],         //��ǰ֡����
            _touch_direction,       //�����ƶ�����
            _move,                  //�ƶ�����(��������)
            _hander,                //�Զ����ŵĺ������
            _time = {},             //��¼�����ϵ�
            _auto,                  //�Ƿ��Զ�����
            _param;                 //�ƶ����Ʋ���,����Ϊx����left,����Ϊy����top
        //������
        var $this = $(element),
            $list1 = $this.find("." + options.contentCls),
            $lists = $list1,
            $prev = $this.find("." + options.prevBtnCls),
            $next = $this.find("." + options.nextBtnCls),
            $nav_list = $(),
            $outer = $lists.parent(),
            $list2,
            $items,
            $window = $(window);    //���ڶ���
        /****** �������Լ����� ******/
        this.element = element;
        //��һ֡
        this.prev = function(e) {
            var status = {
                index: _index,
                count: _size,
                destination: "prev",
                event:e
            };
            if ($lists.is(':animated')) { //�����ڶ������򲻽�����һ��
                return false;
            }
            _time['start'] = + new Date();
            if (options.beforeEvent.call(_.element,status) !== false) {
                var steps = options.steps;
                if(steps=='auto'){  //�Զ��ж�����
                    for(steps=1;_distance[_index+_size]-_distance[_index+_size-steps-1]<=_outer;steps++);
                }
                switch (options.inEndEffect) {
                    case 'none':
                        if (_index) {
                            _index = Math.max(_index-steps,0);
                        }
                        break;
                    case 'cycle':
                        if (_index - steps < 0) {
                            $list2.css(_param,- _distance[_size]-_distance[_index] + 'px');
                            $list1 = [$list2, $list2 = $list1][0]; //���б���ݻ���
                            _index += _size - steps;
                        } else {
                            _index -= steps;
                        }
                        break;
                    default:
                        if (_index) {
                            _index = Math.max(_index-steps,0);
                        } else {
                            _index = _size - 1;
                        }
                }
                slide(options.animate);
            }
        };
        //��һ֡
        this.next = function(e){
            var status = {
                index: _index,
                count: _size,
                destination: "next",
                event:e
            };
            if ($lists.is(':animated')) { //�����ڶ������򲻽�����һ��
                return false;
            }
            _time['start'] = + new Date();
            if (options.beforeEvent.call(_.element,status) !== false) {
                var steps = options.steps;
                if(steps=='auto'){  //�Զ��ж�����
                    for(steps=1;_distance[_index+steps+1]-_distance[_index]<=_outer;steps++);
                }
                switch (options.inEndEffect) {
                    case 'none':
                        if (_distance[_size]-_distance[_index]>_outer) {
                            _index = Math.min(_index + steps,_size - 1);
                        }
                        break;
                    case 'cycle':
                        _index += steps; //����ֵ����
                        break;
                    default:
                        if (_distance[_size]-_distance[_index]>_outer) {
                            _index = Math.min(_index + steps,_size - 1);
                        } else {
                            _index = 0;
                        }
                }
                slide(options.animate);
            }
        };
        //��ʼ����
        this.start = function(){
            _auto = true;
            var time = + new Date();
            var duration = Math.max(options.duration-_time['execute'],0);
            if(options.immediately&&duration){
                _time['start'] = time - _time['execute']; //ʱ�侵�����
                slide(options.animate,duration);
            }else{
                _hander = setTimeout(_.next,options.delay);
            }
        };
        //ֹͣ����
        this.stop = function(){
            _auto = false;
            _hander&&clearTimeout(_hander);
            if(options.immediately&&_time['start']){
                $lists.stop();
                var time = + new Date();
                _time['execute'] = time - _time['start']; //��ִ�ж���ʱ��
            }
        };
        //���ڱ仯
        this.resize = function(){
            _distance = [];
            _inner = 0;
            $items = $lists.children();
            if(options.direction=='x'){
                $lists.css('width','');
                $items.css({
                    'float':'left',
                    'width':''
                });
                _outer = $outer.width();
                $items.each(function(i){
                    var $li = $(this);
                    var width = Math.min($li.width(),_outer);
                    _distance.push(_inner);
                    $li.width(width);
                    _inner += Math.ceil($li.outerWidth(true));
                }).each(function(i){
                    _distance.push(_inner+_distance[i]);
                });
                if(options.inEndEffect=='cycle'){
                    _inner /=2;
                }
                $lists.css('width',_inner);
            }else{
                $items.css('height','');
                _outer = $outer.height();
                $items.each(function(i){
                    var $li = $(this);
                    var height = Math.min($li.height(),_outer);
                    _distance.push(_inner);
                    $li.height(height);
                    _inner += Math.ceil($li.outerHeight(true));
                }).each(function(i){
                    _distance.push(_inner+_distance[i]);
                });
            }
            slide(false);
        };
        //���õ�ǰ֡
        this.setIndex = function(index,isAnimate){
            index = index%_size;
            _index = index<0?_size + index:index;
            slide(isAnimate);
        };
        //�����ƶ�֡��
        this.setsteps = function(steps){
            options.steps = steps;
        };
        //���ö���ͣ��ʱ����
        this.setDelay = function(delay){
            options.delay = delay;
        };
        //���ö���ʱ��
        this.setDuration = function(duration){
            options.duration = duration;
        };
        //��ȡ��ǰ֡
        this.getIndex = function(){
            return _index;
        };
        //��ȡ����
        this.getOptions = function(){
            return options;
        };
        /****** ˽�з��� ******/
        //�ƶ�
        var slide = function(isAnimate,s_duration) {
            if(_inner>=_outer){ //ֻ�����ڲ㳬�����ʱ�ƶ�
                var duration = isAnimate !=false ? (s_duration||options.duration):0; //�жϻ����Ƿ���Ҫ�ƶ�����
                var params = {};
                $lists.stop();
                switch(options.inEndEffect){
                    case 'cycle':
                        params[_param] = - _distance[_index];
                        $list1.animate(params,{easing:options.easing, duration: duration});
                        params[_param] = _distance[_size]-_distance[_index];
                        $list2.animate(params,{easing:options.easing, duration: duration, complete:function(){
                            if (_index >= _size) {
                                _index %= _size;
                                $list1.css(_param, _distance[_size]-_distance[_index]+ 'px');
                                $list1 = [$list2, $list2 = $list1][0]; //���б���ݻ���
                            }
                        }});
                        break;
                    case 'none':
                        _index = Math.min(_index,_size-1);    //������Χ���
                        $prev.toggleClass(options.disableBtnCls,_index==0);
                        $next.toggleClass(options.disableBtnCls,_index==_size-1);
                    default:
                        _index %= _size;
                        if(_distance[_size]-_distance[_index]<_outer){
                            params[_param] = _outer-_inner;
                        }else{
                            params[_param] = - _distance[_index];
                        }
                        $list1.animate(params,{easing:options.easing, duration: duration});
                }
                $nav_list.removeClass(options.activeTriggerCls).eq(_index% _size).addClass(options.activeTriggerCls);   //����ѡ��
                $lists.promise().then(callback);
            }
        };
        //�ƶ���ص�
        var callback = function(){
            var status = {
                index: _index,
                count: _size
            };
            options.afterEvent.call(_.element,status);
            if(_auto){
                _hander&&clearTimeout(_hander);
                _hander = setTimeout(_.next,options.delay);
            }
        };
        //������
        var scroll = function(e){
            e = e||window.event;
            if(!$lists.is(':animated')){ //��ֹ����̫�춯��û���
                var delta = -e.wheelDelta/120||e.detail/3;
                delta>0?_.next(e):_.prev(e);
            }
            return false;
        };
        //������ʼ
        var touchStart = function(e) {
            _touch_direction = null;
            _.stop();
            _time['start'] = + new Date();
            _start = {  //iphone bug��touchstart��touchmoveͬһ������
                pageX: e.originalEvent.changedTouches[0].pageX,
                pageY: e.originalEvent.changedTouches[0].pageY
            };
            _position[0] = $list1.position()[_param];
            if (options.inEndEffect == "cycle") {
                _position[1] = $list2.position()[_param];
            }
        };
        //�����ƶ�
        var touchMove = function(e) {
            e.stopPropagation();
            var current = {  //iphone bug��touchstart��touchmoveͬһ������
                pageX: e.originalEvent.changedTouches[0].pageX,
                pageY: e.originalEvent.changedTouches[0].pageY
            };
            var delta = {
                'x': current.pageX - _start.pageX,
                'y': current.pageY - _start.pageY
            }
            _move = delta[options.direction];  //�ƶ����봥����ľ���
            var direction = Math.abs(delta.y) < Math.abs(delta.x)?'x':'y';
            _touch_direction = _touch_direction||direction; //���ݵ�һ���ƶ������жϷ���
            if(direction==_touch_direction&&_inner>=_outer){ //���˷��ƶ������ϵ���,��ֹ����;����С�����ʱ���ƶ�
                if (options.direction=='x'&&_touch_direction=='x'||options.direction=='y') {  //chrome�ƶ����£�Ĭ���¼����Զ����¼��ĳ�ͻ
                    e.preventDefault();
                    //����
                    if (_move > 0) {  //��ָ���һ�
                        if (_position[0]>0) {   //�Ƿ��û�
                            if(options.inEndEffect=="cycle"){
                                _index = _size-1;
                                _position[1] -= 2*_distance[_size];
                                $list2.css(_param,_position[1] + 'px');
                                $list1 = [$list2, $list2 = $list1][0]; //���б���ݻ���
                                _position[0] = [_position[1], _position[1] = _position[0]][0];
                            }else{
                                _move *= 0.25;
                            }
                        }else if(Math.abs(_position[0])<_distance[_index]){
                            _index--;
                        }
                    } else {    //��ָ����
                        if (_index == _size) {   //�Ƿ��û�
                            if(options.inEndEffect=="cycle"){
                                _index = 0;
                                _position[0] += 2*_distance[_size];
                                $list1.css(_param, _position[0] + 'px');
                                $list1 = [$list2, $list2 = $list1][0]; //���б���ݻ���
                                _position[0] = [_position[1], _position[1] = _position[0]][0];
                            }
                        }else if(Math.abs(_position[0])>=_distance[_index+1]){
                            _index++;
                        }
                        if(options.inEndEffect!="cycle"&&_distance[_size]-_distance[_index]<=_outer){
                            _move *= 0.25;
                        }
                    }
                    //�ƶ�
                    _position[0] += _move;
                    $list1.css(_param, _position[0]);
                    if (options.inEndEffect == "cycle") {
                        _position[1] += _move;
                        $list2.css(_param, _position[1]);
                    }
                    _start = current;       //ʵʱ�������꣬���list�νӴ������л�������
                }
            }
        };
        //��������
        var touchEnd = function(e) {
            if (options.auto) {
                _.start();
            }
            var endTime = new Date();
            var distance = _distance[_index+1]-_distance[_index]; //֡��
            var move = 0;                                        //��ǰ֡�ƶ�����
            var isMove = false;                                   //������ƶ��ж�
            if(_move>0){
                move = _distance[_index+1]+_position[0];
                isMove = move/distance>options.sensitivity||endTime-_time['start']<250&&Math.abs(move)>10;
                if(!isMove){
                    _index++;
                }
            }else{
                move = -_distance[_index]-_position[0];
                isMove = move/distance>options.sensitivity||endTime-_time['start']<250&&Math.abs(move)>10;
                if(isMove){
                    _index++;
                }
            }
            if(options.inEndEffect != "cycle"){
                _index = Math.min(_size-1,_index);
            }
            slide(true,300);
        };
        //���̴���
        var keyboard = function(e){
            if(options.direction=='y'){
                e.which -= 1;
            }
            switch (e.which) {
                case 37:
                    _.prev(e);
                    break;
                case 39:
                    _.next(e);
                    break;
            }
        };
        //��ʼ��
        var init = function(){
            _size = $list1.children().length;
            options.activeIndex = options.activeIndex%_size;
            _index = options.activeIndex<0?_size + options.activeIndex:options.activeIndex;
            _param = options.direction=='x'?'left':'top';
            if($outer.css('position')=='static'){
                $outer.css('position','relative');
            }
            if (options.inEndEffect === "cycle") {
                $list2 = $list1.clone().insertAfter($list1);
                $lists = $list1.add($list2);
                $list2.css({
                    position:'absolute',
                    top:0
                });
            }
            $list1.css('position','relative');
            //�ڵ����
            if (options.hasTriggers) {  //�Ƿ���ڵ���
                if (!$this.find("."+options.navCls).length) {   //ʹ��children�Ҳ���
                    var list_str = "";
                    for (var i = 1; i <= _size ; i++) {
                        list_str += "<li>" + i + "</li>";
                    }
                    $this.append("<ul class='" + options.navCls + "'>" + list_str + "</ul>")
                }
                options.triggerType += options.triggerType === "mouse" ? "enter" : "";  //ʹ��mouseenter��ֹ�¼�ð��
                $nav_list = $this.find("."+options.navCls + " > " + options.triggerCondition).bind(options.triggerType, function(e) {
                    var index = $nav_list.index(this);
                    var status = {
                        index: _index,
                        count: _size,
                        destination: index,
                        event:e
                    };
                    if(options.beforeEvent.call(_.element,status) !== false){
                        _index = index;
                        _time['start'] = + new Date();
                        slide(options.animate,500);
                    }
                });
            }
            //�Ƿ��Զ�����
            if (options.auto) {
                $this.hover(_.stop, _.start);
                _.start();
            }
            //�����ͣ
            $this.hover(function(){
                $this.addClass(options.hoverCls);
            },function(){
                $this.removeClass(options.hoverCls);
            });
            //�¼���-��ǰ��󵼺�
            if(options.pointerType === "click"){
                $prev.on("click",_.prev);
                $next.on("click",_.next);
            }else{
                $prev.on({
                    'mouseenter':function(){
                        _index = 0;
                        slide();
                    },
                    'mouseleave':function(){
                        var distance = -$list1.position().left;
                        for(_index=0;_index<_size&&_distance[_index+1]<=distance;_index++);
                        slide(true,options.duration/2);
                    }
                });
                $next.on({
                    'mouseenter':function(){
                        _index = _size - 1;
                        slide();
                    },
                    'mouseleave':function(){
                        var distance = -$list1.position().left;
                        for(_index=0;_index<_size&&_distance[_index]<=distance;_index++);
                        slide(true,options.duration/2);
                    }
                });
            }
            //���Ʋ���
            if(options.touchable){
                (function(){  //�����������ڲ��Ĵ�������
                    var _s = 0;
                    function touchS(e){
                        _s = {
                            'pageX':e.originalEvent.changedTouches[0].pageX,
                            'pageY':e.originalEvent.changedTouches[0].pageY
                        };
                    }
                    function touchE(e){
                        var current = {
                            'pageX':e.originalEvent.changedTouches[0].pageX,
                            'pageY':e.originalEvent.changedTouches[0].pageY
                        };
                        var d_x = Math.abs(current.pageX - _s.pageX);
                        var d_y = Math.abs(current.pageY - _s.pageY);
                        if(d_x<5&d_y<5){
                            e.stopPropagation();
                        }
                    }
                    $prev.on({
                        'touchstart':touchS,
                        'touchend':touchE
                    });
                    $next.on({
                        'touchstart':touchS,
                        'touchend':touchE
                    });
                })();
                $this.on({
                    'touchstart':touchStart,
                    'touchmove':touchMove,
                    'touchend':touchEnd
                });
            }
            $window.resize(function(){ //�������С�ı�ʱ�����¼�����ز���
                var time = + new Date();
                if(time-_time['start']>250&&options.delay<250||options.delay>=250){ //������������仯��δ���
                    _.resize();
                }
                _time['start'] = time;
            });
            //���̿���
            if(options.keyboardAble){
                $window.keydown(keyboard);
            }
            //����������
            if(options.scrollable){
                if(document.addEventListener){
                    _.element.addEventListener('DOMMouseScroll',scroll,false);
                }
                _.element.onmousewheel = scroll;
            }
            _.resize();
        };
        /* ִ�г�ʼ�� */
        init();
    }

    $.fn.slider = function(parameter,callback) {
        if(typeof parameter == 'function'){ //����
            callback = parameter;
            parameter = {};
        }else{
            parameter = parameter || {};
            callback = callback||function(){};
        }
        var defaults = {
            /* �ڵ�� */
            contentCls: 'content',      //�ֲ������б��class
            navCls: 'nav',              //�ֲ������б��class
            prevBtnCls: 'prev',         //��ǰһ����class
            nextBtnCls: 'next',         //���һ����class
            /* ������� */
            activeTriggerCls: 'active', //����ѡ��ʱ��class
            disableBtnCls: 'disable',   //����������ʱ��class
            hoverCls: 'hover',          //�����������Ӧ����ʱ��õ�class
            steps: 1,                   //�ƶ�֡��,'auto'�Զ��ƶ����¸�û����ʾ������֡
            direction: 'x',             //�ֲ��ķ���
            inEndEffect: 'switch',      //"switch"��ʾ�����л�,"cycle"��ʾѭ��,"none"��ʾ��Ч��
            hasTriggers: true,          //�Ƿ��е���������
            triggerCondition:'*',       //�����������(��ʱ���ų�һЩ�ڵ�)
            triggerType: 'mouse',       //���������¼�:"mouse"���������ʱ����,"click"��ʾ�����ʱ����
            activeIndex: 0,             //Ĭ��ѡ��֡������
            pointerType: 'click',       //���Ҽ�ͷ�Ĵ����¼�
            auto: false,                //�Ƿ��Զ�����
            immediately: false,         //�����Ƿ�����ֹͣ
            animate: true,              //�Ƿ�ʹ�ö�������
            delay: 3000,                //�Զ�����ʱͣ�ٵ�ʱ����
            duration: 500,              //�ֲ��Ķ���ʱ��
            easing:'linear',            //�л�ʱ�Ķ���Ч��
            keyboardAble:false,         //�Ƿ�������̰�������
            touchable: true,            //�Ƿ�������
            sensitivity: 0.4,           //�����������ж�,������ǰ֡�İٷֱ��ƶ���֡����ֵԽСԽ����
            scrollable:false,           //�Ƿ��������������ʱ����
            /* �����¼��ӿ� */
            beforeEvent: function() {    //�ƶ�ǰִ��,����flaseʱ���ƶ�;����һ������,������index�¼�����ǰ����,count֡����,destination����(prev��ǰ,next���,����Ϊ��Ӧ������);
            },
            afterEvent: function() {     //�ƶ���ִ��;����һ������,������index�¼�����ǰ����,count֡����
            }
        };
        var options = $.extend({}, defaults, parameter);
        return this.each(function() {
            var $this = $(this);
            var o = $.meta ? $.extend({}, options, $this.data()) : options;
            var slider = new Slider(this,o);
            callback.call(this,slider);
        });
    };
    //jquery ������չ
    $.extend( $.easing,{
        def: 'easeIn',
        swing: function (x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeIn: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOut: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        expoin: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        expoout: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        expoinout: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        elasin: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        elasout: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        elasinout: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        backin: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        backout: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        backinout: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        bouncein: function (x, t, b, c, d) {
            return c - $.easing.bounceout(x, d-t, 0, c, d) + b;
        },
        bounceout: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        bounceinout: function (x, t, b, c, d) {
            if (t < d/2) return $.easing.bouncein (x, t*2, 0, c, d) * .5 + b;
            return $.easing.bounceout(x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });
})(jQuery, window, document);

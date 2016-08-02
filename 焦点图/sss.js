/**
 * Created by Administrator on 2016/7/13.
 */
//; var slidePictures = new slidePictures("slide_pic","slide_item","preBtn","nextBtn");
(function($) {
    //slidePic:��ͼƬ�����ul��
    //slideItem���ײ�СͼƬ�����ul ��
    // preBtn,nextBtn,�ֱ�Ϊ��ǰ��ť�����ť
    var slidePictures = function(slidePic,slideItem,preBtn,nextBtn) {
        var self          = this;
        this.slidePic     = $("#"+slidePic); //���������ͼƬ�����ul
        this.slideItem    = $("#"+slideItem); //�ײ�СͼƬ�����ul
        this.slidePic_li  = $("#"+slidePic+" li"); //���������ͼƬ
        this.slideItem_li = $("#"+slideItem+" li"); //�ײ�СͼƬ
        this.prevBtn      = $("#"+preBtn); //ǰ����ť
        this.nextBtn      = $("#"+nextBtn); //���˰�ť
        this.length       = this.slidePic_li.length; //ul��ͼƬ�ĸ�������Ϊ��ͼ��Сͼ��һһ��Ӧ�ģ����Ը�����ͬ
        this.speed        = 500; //speedΪͼƬ�����ٶȣ���ֵԽ���ٶ�Խ��
        this.index        = 0; //��һ����ʾ���ǵ�һ��ͼƬ����������Ϊ0��������ǰ������ʾ��ͼƬ����
        this.timer;//����һ����ʱ������
        // ��ʼ���������������
        self.init();
        // ���ȿ�¡һ�ݵ�һ��ͼƬ,��������ӵ����ul��
        var clone = this.slidePic_li.first().clone();
        this.slidePic.append(clone);
        // ������Ҫ���»�ȡһ��li,��Ϊ֮ǰ��this.slidePic_li������ǿ�¡ǰ������
        this.length = $("#slide_pic li").length;

        this.prevBtn.click(function() {
            self.moveByClick(1);
        });
        this.nextBtn.click(function() {
            self.moveByClick(-1);
        });
    }
    slidePictures.prototype = {
        // ��ʼ����������ҳ��ռ������ҳ��һЩĬ�ϵ���ʽ������ִ����غ���
        init: function() {
            // ���ȸ����ulһ��left����Ϊ0��
            this.slidePic.css("left", 0);
            // ��ȡÿһ��ͼƬ�Ŀ��
            this.width = this.slidePic_li.width();
            // ����һ��СͼƬ͸����Ĭ����Ϊ1
            this.slideItem_li.first().css("opacity", "1");
            // ��ÿһ��СͼƬ���һ��id���ԣ����ڱ�ʶ
            this.giveItemAttrId();
            this.autoChange();
            this.cancleTimer();
            this.mouseoverShowBigPic();
        },
        // ͻ����ʾ�ײ�СͼƬ�����ڱ�ʶ��ǰ��ͼλ�ã�idΪ0����ʾ��һ��
        showItem: function(id) {
            // �ж�idֵ
            var item = id;
            if (item == this.length - 1) {
                item = 0;
            }
            // �����е�СͼƬ͸������Ϊ.3
            this.slideItem_li.css("opacity", ".3");
            // ����ǰid��СͼƬ͸������Ϊ1
            this.slideItem_li.eq(item).css("opacity", "1");
        },
        // �õ���ǰ͸����ΪneedOpc��ͼƬ���
        getCurrentShowPic: function(needOpc) {
            var item = 0;
            this.slideItem_li.each(function(index, el) {
                var opc = $(this).css("opacity");
                if (opc == needOpc) {
                    item = index;
                }
            });
            return item;
        },
        mouseoverShowBigPic:function(){
            var self = this;
            this.slideItem_li.on('mouseover',function(){
                var id = $(this).attr("id");
                self.showNow(id);//��ʾ��ͼƬ
                self.showItem(id);//��ʾ��ӦСͼƬ
            })
        },
        // ��껮��СͼƬʱ��ʾ��Ӧ�Ĵ�ͼ
        showNow: function(id) {

            // �ҵ���ǰ��ʾ��ͼƬ����ţ�itemΪ��ǰ���
            var item = this.getCurrentShowPic();
            // ������Ҫ�ƶ��ľ���
            var needMove = id * this.width;
            // �����ǰ��ʾ��ͼƬ����껮����ͼƬ���󷽣������󻬶����������һ���
            if (id > item) {
                this.slidePic.stop().animate({ left: "-" + needMove + "px" }, this.speed);
            } else {
                this.slidePic.stop().animate({ left: "-" + needMove + "px" }, this.speed);
            }
            // ����this.index;
            this.index = id;
        },
        // ÿ����������Ұ�ťʱ����һ��ͼƬ
        moveByClick: function(flag) {
            //���û�д��������Ĭ��Ϊ1��
            var flag = flag||-1;
            // flag���ڱ�ǵ��������������Ҽ�,flag > 0Ϊ�������֮Ϊ�Ҽ�
            // lengthΪͼƬ�ĸ���
            var length = this.length;
            var width = this.width;
            var speed = this.speed;
            // ������������ʱ
            if (flag > 0) {
                this.index--;
                if (this.index == -1) {
                    this.slidePic.css("left", "-" + (length - 1) * width + "px");
                    // ͻ����ʾ��Ӧ�ĵײ�СͼƬ
                    this.index = length - 2;
                }
                this.slidePic.stop().animate({ left: "-" + this.index * width + "px" }, speed);
                this.showItem(this.index);

            } else { //����Ҽ�ʱ
                this.index++;
                /*��indexΪ���һ��ͼƬʱ���Ƚ����ul��leftֵ��Ϊ0
                 ��ʱ���һ��ͼƬΪ������¡����ϵģ���leftֵ��Ϊ0��ʵ������ʾ���ǵ�һ��ͼƬ��
                 �����������һ�ź͵�һ����ͬ�����ۿ��������������Ϊ��û�иı�
                 Ȼ���ٽ�index��Ϊ1�������л�����һ��ͼƬ���Ӷ�ʵ���޷��ֲ�
                 ������ʱԭ����ͬ
                 */
                if (this.index == length) {
                    this.slidePic.css("left", "0px");
                    this.index = 1;
                }
                this.slidePic.stop().animate({ left: "-" + this.index * width + "px" }, speed);
                this.showItem(this.index);

            }
        },
        // �����е�СͼƬ͸������Ϊ��Ҫ��ֵ
        hideAllitem: function(opc) {
            this.slideItem_li.each(function(index, el) {
                $(this).css("opacity", opc);
            });
        },

        // �Զ��л�
        autoChange: function() {
            var self = this;
            this.timer = setInterval(function(){
                self.moveByClick();
            },1500);
        },
        //����껮���������ʱ��ֹͣ�Զ�����
        cancleTimer:function(){
            var self = this;
            $(".jq_wrap").on("mouseover",function(){
                clearInterval(self.timer);
            });
            $(".jq_wrap").on("mouseout",function(){
                self.autoChange();
            })
        },
        // ���ײ�СͼƬһ��id���ԣ����ڱ�ʶ
        giveItemAttrId: function() {
            var self = this;
            this.slideItem_li.each(function(index, el) {
                $(this).attr("id", index);
            });
        }
    };
    window["slidePictures"] = slidePictures;
})(jQuery);

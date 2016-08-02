//download by http://www.codefans.net
$(document).ready(function(){

    $('#slider').cycle({
        fx:      'scrollHorz',
        timeout:  0,
        prev:    '#prev',
        next:    '#next',
        pager:   '#pagination',
		speed: 800,
		timeout: 6000, 
		cleartype:  true,
		slideExpr: '.item',
        pagerAnchorBuilder: pagerFactory
    });

    function pagerFactory(idx, slide) {
        var s = idx > 2 ? ' style="display:none"' : '';
        return '<li'+s+'><a href="#"  class="nav_button"><span>'+(idx+1)+'</span></a></li>';
    };
    
});


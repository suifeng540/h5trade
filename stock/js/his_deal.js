define(function(require, exports, module) {
	var $ = require('jquery'),
		appUtils = require('appUtils'),
		layerUtils = require('layerUtils'),
		service = require('stockService').getInstance();

	//页面初始化
	function init(){
	
		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});
		
		queryHisDealt();//查询历史成交
	    
	}
	
	//绑定页面元素事件
	function bindPageEvent(){
		//返回
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});	
		
		//确定
		appUtils.bindEvent($('#btn'),function() {
			queryHisDealt();
		});
		
		//选择起始日期
		appUtils.bindEvent($('#selStartDate,#selEndDate'),function() {
			$(this).prev().html($(this).val());
		}, 'change');
	}

	//查询历史成交
	function queryHisDealt() {
		var sDate = $('#selStartDate').val();
		var eDate = $('#selEndDate').val();
	
		if (!sDate){
			$('#startDate').html(dateToFormat(-30));
			$('#selStartDate').val(dateToFormat(-30));
			sDate = $('#selStartDate').val();
		}
		if (!eDate){
			$('#endDate').text(dateToFormat(0));
			$('#selEndDate').val(dateToFormat(0));
			eDate = $('#selEndDate').val();
		}
	
		if (new Date(sDate.replace(/\-/g, ',')).getTime() - new Date(eDate.replace(/\-/g, ',')).getTime() > 0) {
	  		 layerUtils.iMsg('开始日期不能大于结束日期');
		} else {
			$(".list").html("");//查询之前清除内容
			service.queryHisDealt(function(data){
				if (data.error_no == 0) {
					var strHTML = '';
					data.results.sort(function(a, b){
						return parseInt(b.cleardate.replace(/\-/g,''))-parseInt(a.cleardate.replace(/\-/g,'')) == 0? parseInt(b.matchtime.replace(/:/g,'')) - parseInt(a.matchtime.replace(/:/g,'')) : parseInt(b.cleardate.replace(/\-/g,''))-parseInt(a.cleardate.replace(/\-/g,''));
					}).forEach(function(item){
						strHTML += '<ul>'
								 +  	'<li>'
								 + 			'<p>' + item.cleardate + '</p>'
								 +  		'<p>' + item.matchtime + '</p>'
								 +  	'</li>'
								 +  	'<li>'
								 +  		'<p>' + (item.stkname!='' && typeof item.stkname !='undefined' ? item.stkname:'--') + '</p>'
								 +  		'<p>' + (item.stkcode!='' ? item.stkcode:'--') + '</p>'
								 +  	'</li>'
								 +  	'<li>'
								 +  		'<p>' + $.format(item.matchprice, 2) + '</p>'
								 +  		'<p>' + item.matchqty + '</p>'
								 +  	'</li>'
								 +  	'<li>'
								 +  		'<p>' + item.bsflagname + '</p>'
								 +  		'<p>' + $.format(item.matchamt, 2) + '</p>'
								 +  	'</li>'
								 +  '</ul>';
					});
					if(strHTML == ''){
						$('<p class="nodata">没有查询到数据</p>').appendTo('#list').show();
					}else{
						$("#list").html(strHTML);
					}
					
				} else {
					layerUtils.iMsg(data.error_info);
				}
			}, sDate, eDate);
	
		}
		
	}
	
	//时期格式
	function dateToFormat(apartNowDays){
		var now = new Date();
		var getDate = new Date(now.getTime() + 3600 * 24 * 1000 * apartNowDays);
		var year = getDate.getFullYear();//年
	    var month = getDate.getMonth()+1;//月
	    var day = getDate.getDate();//日
	    if (month < 10) month = "0" + month;
	    if (day < 10) day = "0" + day;
	    return year+"-"+month+"-"+day;
	}

	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});
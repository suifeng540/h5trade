define(function(require, exports, module) {
	var $ = require('jquery'),
		service = require("stockService").getInstance(),
		layerUtils = require("layerUtils"),
		appUtils = require('appUtils');

	//ҳ���ʼ��
	function init(){
		$('div.list').css({'height':$(window).height()-$('div.list').offset().top});
	    
	    queryDeliverySingle();//��ѯ���
	}
	
	//��ҳ��Ԫ���¼�
	function bindPageEvent(){
		//����
		appUtils.bindEvent($('.header a.back'),function() {
			history.go(-1);
		});
		
		//��ѯ
		appUtils.bindEvent($('#btn'),function() {
			queryDeliverySingle();
		});
		
		//ѡ����ʼ����
		appUtils.bindEvent($('#selStartDate,#selEndDate'),function() {
			$(this).prev().html($(this).val());
		}, 'change');
	}
	
	//��ѯ���
	function queryDeliverySingle(){
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
	
		if (new Date(sDate.replace(/\-/g, '')).getTime() - new Date(eDate.replace(/\-/g, '')).getTime() > 0) {
	  		 layerUtils.iMsg('��ʼ���ڲ��ܴ��ڽ�������');
		} else {
			$(".list").html('');//��ѯ֮ǰ�������
			service.queryDeliverySingle(function(data){
				if (data.error_no == 0) {
					var strHTML = '';
					data.results.sort(function(a, b){
						return parseInt(b.bizdate.replace(/\-/g,''))-parseInt(a.bizdate.replace(/\-/g,'')) == 0? parseInt(b.ordertime.replace(/:/g,'')) - parseInt(a.ordertime.replace(/:/g,'')) : parseInt(b.bizdate.replace(/\-/g,''))-parseInt(a.bizdate.replace(/\-/g,''));
					}).forEach(function(item){
						strHTML += '<ul>'
								 +  	'<li>'
								 +  		'<p>' + item.bizdate.replace(/(.{4})(.{2})/,'$1-$2-') + '</p>'
								 +  		'<p>' + item.digestname + '</p>'
								 +  	'</li>'
								 +  	'<li>'
								 +  		'<p>' + (item.stkname!='' ? item.stkname:'&nbsp;') + '</p>'
								 +  		'<p>' + (item.stkcode!='' ? item.stkcode:'&nbsp;') + '</p>'
								 +  	'</li>'
								 +  	'<li>'
								 +  		'<p>' + $.format(item.matchamt, 2) + '</p>'
								 +  		'<p>' + $.format(item.fee_sxf, 2) + '</p>'
								 +  	'</li>'
								 +  	'<li>'
								 +  		'<p>' + $.format(item.fundeffect, 2) + '</p>'
								 +  		'<p>' + $.format(item.fundbal, 2) + '</p>'
								 +  	'</li>'
								 +  '</ul>';
					});
					if(strHTML == ''){
						$('<p class="nodata">û�в�ѯ������</p>').appendTo('#list').show();
					}else{
						$("#list").html(strHTML);
					}

				}else {
					layerUtils.iMsg(data.error_info);
				}
			}, sDate, eDate);
		}
	}
	
	//ʱ�ڸ�ʽ
	function dateToFormat(apartNowDays){
		var now = new Date();
		var getDate = new Date(now.getTime() + 3600 * 24 * 1000 * apartNowDays);
		var year = getDate.getFullYear();//��
	    var month = getDate.getMonth()+1;//��
	    var day = getDate.getDate();//��
	    if (month < 10) month = "0" + month;
	    if (day < 10) day = "0" + day;
	    return year+"-"+month+"-"+day;
	}
	
	module.exports = {
		init: init,
		bindPageEvent: bindPageEvent
	};
});
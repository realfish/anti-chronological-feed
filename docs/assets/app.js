(function () {
	'use strict';

	function _misc () {
	  var doc = document; // UA marking

	  var UA_LIST = ['iPhone', 'iPad', 'MQQBrowser', 'Android', 'MicroMessenger', 'Trident'];
	  var ua = navigator.userAgent;
	  var $html = doc.getElementsByTagName('html')[0];

	  for (var i = 0; i < UA_LIST.length; i++) {
	    var uaRegExp = new RegExp(UA_LIST[i]);

	    if (ua.match(uaRegExp)) {
	      $html.classList.add('ua-' + UA_LIST[i]);
	    }
	  }

	  if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
	    $html.classList.add('ua-Safari');
	  }

	  if (!('ontouchstart' in window)) {
	    $html.classList.add('ua-Pointer');
	  } // Enable the CSS `:active` interactions


	  doc.getElementsByTagName('body')[0].addEventListener('touchstart', function () {}, {
	    passive: true
	  });
	  doc.getElementsByTagName('main')[0].addEventListener('touchstart', function () {}, {
	    passive: true
	  }); // Twist HTML language
	  // doc.getElementsByTagName('html')[0].setAttribute('lang', 'en');
	}

	/* global _, axios, dayjs, Han */
	function viewIndex () {
	  var doc = document;
	  var win = window; // dayjs.locale('zh-cn');

	  var DATE_CN_NUM = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	  var DATE_CN_MON = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
	  var DATE_CN_DAY = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一'];
	  var API_FEED = 'assets/feed.xml';
	  axios.get(API_FEED).then(function (res) {
	    return res.data;
	  }).then(function (data) {
	    return new win.DOMParser().parseFromString(data, "text/xml");
	  }).then(function (feedDoc) {
	    // console.log(feedDoc);
	    var $allItems = feedDoc.querySelectorAll('item');
	    var dataItems = [];
	    $allItems.forEach(function ($item) {
	      // console.log($item);
	      var date = dayjs($item.querySelector('pubDate').textContent);
	      var dateY = DATE_CN_NUM[date.format('YYYY')[0]] + DATE_CN_NUM[date.format('YYYY')[1]] + DATE_CN_NUM[date.format('YYYY')[2]] + DATE_CN_NUM[date.format('YYYY')[3]] + '年';
	      var dateM = DATE_CN_MON[date.format('M') - 1] + '月';
	      var dateD = DATE_CN_DAY[date.format('D') - 1] + '日'; // console.log(date.format('YYYY.MMMM.D'), dateY, dateM, dateD);

	      var item = {
	        title: $item.querySelector('title').textContent,
	        link: $item.querySelector('guid').textContent,
	        date: dateY + dateM + dateD
	      };
	      dataItems.push(item);
	    });
	    var tmplText = doc.querySelector('#tmpl-timeline').text;

	    var tmplFunc = _.template(tmplText);

	    var tmplHtml = tmplFunc({
	      items: dataItems
	    }); // console.log(tmplHtml);

	    var $timeline = doc.querySelector('.timeline');
	    $timeline.innerHTML = tmplHtml;
	    Han($timeline).initCond().renderElem() // .renderHanging()
	    .renderJiya().renderHWS();
	  });
	  Han(doc.querySelector('.note')).initCond().renderElem() // .renderHanging()
	  .renderJiya().renderHWS();
	}

	var doc = document; // Misc

	_misc(); // Class

	var view = doc.querySelector('body').classList[0];

	switch (view) {
	  case 'index':
	    {
	      viewIndex();
	      break;
	    }
	}

}());

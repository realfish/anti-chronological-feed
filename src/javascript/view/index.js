/* global _, axios, dayjs, Han */

export default function () {

let doc = document;
let win = window;
// dayjs.locale('zh-cn');

const DATE_CN_NUM = ['〇', '一', '二' , '三', '四', '五', '六', '七' , '八', '九'];
const DATE_CN_MON = ['一', '二' , '三', '四', '五', '六', '七' , '八', '九', '十', '十一', '十二'];
const DATE_CN_DAY = [
	'一', '二', '三', '四', '五', '六', '七' , '八', '九', '十',
	'十一', '十二', '十三', '十四', '十五', '十六', '十七' , '十八', '十九', '二十',
	'二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七' , '二十八', '二十九', '三十', '三十一'
]
// const API_FEED = 'assets/feed.xml';
// const API_FEED = 'https://qingmang.me/users/131995/feed/';
const API_FEED = 'https://realfish-cors-anywhere.herokuapp.com/https://qingmang.me/users/131995/feed/';
axios.get(API_FEED)
.then(res => res.data)
.then(data => new win.DOMParser().parseFromString(data, "text/xml"))
.then(feedDoc => {
	let $loader = doc.querySelector('.timeline-loader');
	$loader.classList.add('is-finished');
	
	// console.log(feedDoc);
	let $allItems = feedDoc.querySelectorAll('item');
	let dataItems = [];
	$allItems.forEach(($item) => {
		// console.log($item);
		let date = dayjs($item.querySelector('pubDate').textContent);
		let dateY = DATE_CN_NUM[date.format('YYYY')[0]] +
		            DATE_CN_NUM[date.format('YYYY')[1]] +
		            DATE_CN_NUM[date.format('YYYY')[2]] +
		            DATE_CN_NUM[date.format('YYYY')[3]] + '年';
		let dateM = DATE_CN_MON[date.format('M') - 1] + '月';
		let dateD = DATE_CN_DAY[date.format('D') - 1] + '日';
		// console.log(date.format('YYYY.MMMM.D'), dateY, dateM, dateD);
		
		let item = {
			title: $item.querySelector('title').textContent,
			link: $item.querySelector('guid').textContent,
			date: dateY + dateM + dateD,
		};
		dataItems.push(item);
	})
	
	let tmplText = doc.querySelector('#tmpl-timeline').text;
	let tmplFunc = _.template(tmplText);
	let tmplHtml = tmplFunc({ items: dataItems });
	// console.log(tmplHtml);
	
	let $timeline = doc.querySelector('.timeline');
	$timeline.innerHTML = tmplHtml;
	
	Han($timeline)
	.initCond()
	.renderElem()
	// .renderHanging()
	.renderJiya()
	.renderHWS();
	
	$timeline.classList.add('is-finished');
});

Han(doc.querySelector('.note'))
.initCond()
.renderElem()
// .renderHanging()
.renderJiya()
.renderHWS();

}

// history API 实现无刷新单页应用
if(window.history && 'pushState' in history) {
	// 增量式体验开发
	(function(){
		'use strict'
		function displayContent(state, reverse) {
			document.title = state.title;
			// $('.content').html(state.content);
			// $('.photo').attr('src',state.photo);
			// 复制一份
			var cloneEle = $('.wrapper').clone();
			cloneEle.find('.content').html(state.content);
			cloneEle.find('.photo').attr('src',state.photo);
			$('.wrapper')
				.addClass((!reverse)?'transition-out':'transition-in')
				.after(cloneEle.addClass((!reverse)?'transition-in':'transition-out'))
				.one('webkitTransitionEnd', function() {
					$(this).remove();
				});
				setTimeout(function(){
					cloneEle.removeClass((!reverse)?'transition-in':'transition-out')
				},500)
		}
		function createState(content) {
			var state = {
				content: content.find('.content').html(),
				photo: content.find('.photo').attr('src'),
				title: content.filter('title').text()
			}
			console.log(state);
			return state;
		}
		$(document).on('click', 'a', function(evt) {
			evt.preventDefault();
			// var strHref = this.href;
			// alert(strHref);
			var req = $.ajax(this.href);
			req.done(function (data) {
				// console.log($(data));
				var state = createState($(data));
				displayContent(state);
				// 将页面信息放入地址栈列
				// 执行pushState函数之后，会往浏览器的历史记录中添加一条新记录，同时改变地址栏的地址内容。它可以接收三个参数，按顺序分别为：
				// 一个对象或者字符串，用于描述新记录的一些特性。这个参数会被一并添加到历史记录中，以供以后使用。这个参数是开发者根据自己的需要自由给出的。
				// 一个字符串，代表新页面的标题。当前基本上所有浏览器都会忽略这个参数。
				// 一个字符串，代表新页面的相对地址。
				history.pushState(state, state.title, evt.target.href);
			})
			req.fail(function() {
				document.location = evt.target.href;
			})
		})
		// 将页面弹出栈列
		// 当用户点击浏览器的「前进」、「后退」按钮时，就会触发popstate事件
		// 这里e.state就是当初pushState时传入的第一个参数
		window.onpopstate = function (evt) {
			if(evt.state) {
				displayContent(evt.state, true);
			}
		}
		var state = createState ($('title,body'));
		// 有时，你希望不添加一个新记录，而是替换当前的记录（比如对网站的 landing page）
		// ，则可以使用replaceState方法。这个方法和pushState的参数完全一样。
		history.replaceState(state,document.title,document.location.href);
	})();
}

import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';

const createVApp = (count) => createElement('div', {
	attrs: {
		id: 'app',
		dataCount: count
	},
	children: [
		String(count),
		createElement('img', {
			attrs: {
				src: 'https://media.giphy.com/media/dUfWt7y5Mp99kbtSAW/giphy.gif'
			}
		})
	],
});


let count = 0;
const vApp = createVApp(count);

const $app = render(vApp);

let $rootEl = mount($app, document.getElementById('app'));

setInterval(() => {
	count++;
	$rootEl = mount(render(createVApp(count)), $rootEl);
}, 1000);

console.log(app)

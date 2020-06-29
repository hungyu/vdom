import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

const createVApp = (count) => createElement('div', {
	attrs: {
		id: 'app',
		dataCount: count
	},
	children: [
		String(count),		
		createElement('input'),
		createElement('img', {
			attrs: {
				src: 'https://media.giphy.com/media/dUfWt7y5Mp99kbtSAW/giphy.gif'
			}
		})
	],
});


let count = 0;
let vApp = createVApp(count);

const $app = render(vApp);

let $rootEl = mount($app, document.getElementById('app'));

setInterval(() => {
	count++;
	const vNewApp = createVApp(count);
	const patch = diff(vApp, vNewApp);

	patch($rootEl);
	vApp = vNewApp;
}, 1000);

console.log(app)

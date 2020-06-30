import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

// create app
const createVApp = (state) => createElement('div', {
	attrs: {
		id: 'app',
		dataCount: state.count
	},
	children: [
		String(state.count),		
		createElement('input'),
		createElement('img', {
			attrs: {
				src: 'https://media.giphy.com/media/dUfWt7y5Mp99kbtSAW/giphy.gif'
			}
		})
	],
});


// first render
let state = { count: 0 };
let vApp = createVApp(state);
const $app = render(vApp);
let $rootEl = mount($app, document.getElementById('app'));

// use proxy to listen to onchange event
const handler = {
	set: (state, prop, value) => {
		state[prop] = value;
		// do diff
		const vNewApp = createVApp(state);
		// patch changes
		const patch = diff(vApp, vNewApp);
		// apply to DOM
		patch($rootEl);
		// assign old virtual dom to new virtual dom
		vApp = vNewApp;
		return true;
	}
}

const proxyState = new Proxy(state, handler);

// simulate state change
setInterval(() => {
	proxyState.count += 1;
}, 1000);


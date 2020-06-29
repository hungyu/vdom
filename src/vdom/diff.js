import render from './render';

// helper zip function
const zip = (ary1, ary2) => {
	const zipped = [];

	for (let i = 0; i < Math.min(ary1.length, ary2.length); i++) {
		zipped.push([ary1[i], ary2[i]]);
	}

	return zipped;
}


// diff Attrs
const diffAttrs = (oldAttrs, newAttrs) => {
	const patches = [];

	// set Attributes for new attributes
	for (const [k, v] of Object.entries(newAttrs)) {
		patches.push($node => {
			$node.setAttribute(k, v);
			return $node;
		});
	}

	// remove Attributes in old attrs which is not in new attrs
	for (const k in oldAttrs) {
		if(!(k in newAttrs)) {		
			patches.push($node => {
				$node.removeAttribute(k);
				return $node;
			});
		}
	}

	return $node => {
		for (const patch of patches) {
			patch($node);
		}
	}
}

const diffChildren = (oldChildren, newChildren) => {
	// compare children element one by one to see if is same node
	const childPatches = [];
	for (const [oldChild, newChild] of zip(oldChildren, newChildren)) {
		childPatches.push(diff(oldChild, newChild));
	}

	// if new Children length is greater than old children, we need to create new DOM elements for them
	const additionalPatches = [];
	for (const additionalChild of newChildren.slice(oldChildren.length)) {
		additionalPatches.push($node => {
			// render the new elements and its children
			$node.appendChild(render(additionalChild));
			return $node;
		});
	}

	return $node => {
		// patch childPatches
		for (const [patch, child] of zip(childPatches, $node.childNodes)) {
			patch(child);
		}

		// patch additionalPatches
		for (const patch of additionalPatches) {
			patch($node);
		}

		return $node;
	}
}

// main diff function
const diff = (vOldNode, vNewNode) => {
	if (vNewNode === undefined) {
		return $node => {
			$node.remove();
			return undefined;
		}
	}

	// handle string case
	if (typeof vOldNode === 'string' || 
			typeof vNewNode === 'string') {
		if (vOldNode !== vNewNode) {
			return $node => {
				const $newNode = render(vNewNode);
				$node.replaceWith($newNode);
				return $newNode;
			}
		} else {
			return $node => undefined;
		}
	}

	// if tagName is not the same, we just create new element.
	if (vOldNode.tagName !== vNewNode.tagName) {
		return $node => {
			const $newNode = render(vNewNode);
			$node.replaceWith($newNode);
			return $newNode;
		}
	}

	// if tagName is the same, we caculate the difference of attrs and children
	const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
	const patchChildren = diffChildren(vOldNode.children, vNewNode.children);


	return $node => {
		patchAttrs($node);
		patchChildren($node);
		return $node;
	};
}

export default diff;
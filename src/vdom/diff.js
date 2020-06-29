const diffAttrs = (oldAttrs, newAttrs) => {
	const patches = [];

	// set Attributes
	for (const [k, v] of Object.entries(newAttrs)) {
		patches.push($node => {
			$node.setAttribute(k, v);
			return $node;
		});
	}

	// remove Attributes
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


	if (vOldNode.tagName !== vNewNode.tagName) {
		return $node => {
			const $newNode = render(vNewNode);
			$node.replaceWith($newNode);
			return $newNode;
		}
	}

	const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
	// const patchChildren = diffChildren(vOldNode.children, vNewNode.children);


	return $node => {
		patchAttrs($node);
		// patchChildren($node);
		return $node;
	};
}

export default diff;
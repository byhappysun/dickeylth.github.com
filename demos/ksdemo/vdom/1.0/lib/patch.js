/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component patch
 */
KISSY.add(function (S, domIndex, patchOp) {

	"use strict";

	var isArray = S.isArray;

	function patch(rootNode, patches) {
		return patchRecursive(rootNode, patches)
	}

	function patchRecursive(rootNode, patches, renderOptions) {
		var indices = patchIndices(patches)

		if (indices.length === 0) {
			return rootNode
		}

		var index = domIndex(rootNode, patches.a, indices)
		var ownerDocument = rootNode.ownerDocument

		if (!renderOptions) {
			renderOptions = { patch: patchRecursive }
			if (ownerDocument !== document) {
				renderOptions.document = ownerDocument
			}
		}

		for (var i = 0; i < indices.length; i++) {
			var nodeIndex = indices[i]
			rootNode = applyPatch(rootNode,
				index[nodeIndex],
				patches[nodeIndex],
				renderOptions)
		}

		return rootNode
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
		if (!domNode) {
			return rootNode
		}

		var newNode

		if (isArray(patchList)) {
			for (var i = 0; i < patchList.length; i++) {
				newNode = patchOp(patchList[i], domNode, renderOptions)

				if (domNode === rootNode) {
					rootNode = newNode
				}
			}
		} else {
			newNode = patchOp(patchList, domNode, renderOptions);

			if (domNode === rootNode) {
				rootNode = newNode
			}
		}

		return rootNode;
	}

	function patchIndices(patches) {
		var indices = [];

		for (var key in patches) {
			if (key !== "a") {
				indices.push(Number(key))
			}
		}

		return indices;
	}

	return patch;
}, {requires: [
	'./dom-index',
	'./patch-op'
]});
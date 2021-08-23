const VariantSelector = function () {

	return {
		init: function () {
			//Auto initialize
			document.querySelectorAll(".js-variant-selector").forEach(function (variantSelector) {
				VariantSelector.UpdateAllVariants(variantSelector);
			});
		},

		OptionClick: function (e) {
			var clickedButton = e.currentTarget;
			var variantSelectorElement = clickedButton.closest(".js-variant-selector");

			VariantSelector.ToggleActiveState(clickedButton);
			VariantSelector.UpdateAllVariants(variantSelectorElement);
			VariantSelector.CheckSelectionComplete(variantSelectorElement);
		},	    

		UpdateAllVariants: function (variantSelectorElement) {
			var combinations = variantSelectorElement.getAttribute("data-combinations");
			combinations = combinations.split(",");

			//Go through each option, in their group, and check the availability
			variantSelectorElement.querySelectorAll(".js-variant-option").forEach(function (option) {
				var groupId = option.closest(".js-variant-group").getAttribute("data-group-id");
				var variantId = option.getAttribute("data-variant-id");

				option.classList.add("in-active");

				var show = VariantSelector.IsOptionAvailable(variantSelectorElement, variantId, groupId, combinations);

				if (show == true) {
					option.classList.remove("in-active");
				}
			});
		},

		IsOptionAvailable: function (variantSelectorElement, currentVariantId, currentGroupId, combinations) {
			var show = false;
			var selections = [];

			//Add the VariantId we are testing for
			selections.push(currentVariantId);

			//Find all selections, excluding selections in the current group
			variantSelectorElement.querySelectorAll(".js-variant-option").forEach(function (option) {
				var parentGroupId = option.closest(".js-variant-group").getAttribute("data-group-id");

				if (parentGroupId != currentGroupId) {
					if (option.classList.contains("active")) {
						var activeVariantId = option.getAttribute("data-variant-id");
						selections.push(activeVariantId);
					}
				}
			});

			var selectionsTotal = selections.length;

			//Compare the selections with the available combinations
			combinations.forEach(function (combi) {
				var selectionsCount = 0;
				var combiVariantIds = combi.split(".");

				combiVariantIds.forEach(function (combiVariantId) {
					selections.forEach(function (selectionVariantId) {
						if (combiVariantId == selectionVariantId) {
							selectionsCount++;
						}
					});
				});

				if (selectionsCount == selectionsTotal) {
					show = true;
				}
			});

			return show;
		}, 

		ToggleActiveState: function (clickedButton) {
			var inactiveClicked = clickedButton.classList.contains("in-active");
			var isAlreadyActive = clickedButton.classList.contains("active");

			//Allow clicking in-active options
			if (inactiveClicked) {
				clickedButton.closest(".js-variant-selector").querySelectorAll(".js-variant-option").forEach(function (option) {
					option.classList.remove("active");
				});
			}

			//Remove all active options in the current group
			clickedButton.closest(".js-variant-group").querySelectorAll(".js-variant-option").forEach(function (option) {
				option.classList.remove("active");
			});

			//Add active to the selected options
			if (!isAlreadyActive) {
				clickedButton.classList.add("active");
			}
		},

		CheckSelectionComplete: function (variantSelectorElement) {
			var selections = [];
			var selectionCount = 0;
			var totalGroups = variantSelectorElement.querySelectorAll(".js-variant-group").length;

			variantSelectorElement.querySelectorAll(".js-variant-option").forEach(function (option) {
				if (option.classList.contains("active")) {
					var activeVariantId = option.getAttribute("data-variant-id");
					selections.push(activeVariantId);
					selectionCount++;
				}
			});

			if (selectionCount == totalGroups) {
				var url = new URL(window.location);
				var searchParams = url.searchParams;

				searchParams.set('variantid', selections.join("."));
				url.search = searchParams.toString();
				window.location = url.toString();
			}

			var productElement = variantSelectorElement.closest(".js-product");
			if (productElement) {
				var addToCartElement = variantSelectorElement.querySelector(".js-add-to-cart");
				if (addToCartElement) {
					if (selectionCount == totalGroups) {
						addToCartElement.classList.remove("disabled");
					} else {
						addToCartElement.classList.add("disabled");
					}
				}

				var stockStateElement = variantSelectorElement.querySelector(".js-stock-state");
				if (stockStateElement) {
					if (selectionCount == totalGroups) {
						stockStateElement.classList.remove("d-none");	 
					} else {
						stockStateElement.classList.add("d-none");
					}
				}
			}
		}
	}
}();

export { VariantSelector };

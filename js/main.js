(function(){
	'use strict';

	$(document).ready(initialize);

	function initialize()
	{
		$("#cacheOrganizationForm").on("submit", function(evt){
			evt.preventDefault();

			var inputData = getFormData(this);
			var cache = new Cache(inputData.blocks, inputData.blockSize, inputData.associativity);
			var addressFormation = new AddressFormation(cache, inputData.addressSize);
			console.log(inputData);
			var i = [];	
			//allPossibleCombinations([8, 6], function(a) { console.log(a); });
		});
	}

	function getFormData(form)
	{
		var formData = {};
		var inputs = $(form).serializeArray();
		$.each(inputs, function(i, input){
			formData[input.name] = input.value;
		});

		return formData;
	}

	function allPossibleCombinations(lengths, fn) {
	  var n = lengths.length;

	  var indices = [];
	  for (var i = n; --i >= 0;) {
	    if (lengths[i] === 0) { return; }
	    if (lengths[i] !== (lengths[i] & 0x7ffffffff)) { throw new Error(); }
	    indices[i] = 0;
	  }

	  while (true) {
	    fn.apply(null, [indices]);
	    // Increment indices.
	    ++indices[n - 1];
	    for (var j = n; --j >= 0 && indices[j] === lengths[j];) {
	      if (j === 0) { return; }
	      indices[j] = 0;
	      ++indices[j - 1];
	    }
	}
}
})();
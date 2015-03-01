(function(){
	'use strict';

	angular
		.module('app.cache')
		.controller('CacheController', CacheController);

	CacheController.$inject = ['$scope', 'Cache'];
	function CacheController($scope, Cache)
	{
		var vm = this;
		vm.cache = new Cache();
		vm.result = null;
		vm.reset = reset;
		vm.submitForm = submitForm;
		vm.hasResult = false;
		vm.getWidth = getWidth;

		function reset() {
			vm.cache = new Cache();
			vm.result = null;
			vm.hasResult = false;
		}

		function submitForm() {
			vm.result = vm.cache.addressFormation();
			vm.hasResult = hasResult();
		}

		function hasResult() {
			return vm.result != null && _.isEmpty(vm.result.errors);
		}

		function getWidth(field) {
			console.log(field);
			return (Math.floor(vm.result[field]/vm.result.addressSize*100) - 2) + '%';
		}
	}

})();
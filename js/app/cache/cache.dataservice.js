(function(){
	'use strict';

	angular
		.module('app.cache')
		.factory('Cache', Cache);

	function Cache()
	{
		function service()
		{
			var possibleSizeUnits = [
				{'name': 'Word', 'code' : 'W', 'value' : '2'},
				{'name': 'Byte', 'code' : 'B', 'value' : '0'},
				{'name': 'KB', 'code' : 'KB', 'value' : '10'},
				{'name': 'MB', 'code' : 'MB', 'value' : '20'},
				{'name': 'GB', 'code' : 'GB', 'value' : '30'},
			];

			this.cacheSize = '';
			this.cacheSizeUnit = possibleSizeUnits[1];			
			this.blockSize	= '';
			this.blockSizeUnit	= possibleSizeUnits[1];
			this.blocks	= '';
			this.associativity = 1;
			this.addressSize = ''; //bits
			this.addressFormation = getAddressFormation;
			this.possibleSizeUnits = possibleSizeUnits;
			this.possibleBlockSizeUnits	= possibleSizeUnits.slice(0, 2);
		}

		return service;

		//////////////////////////////////////////

		function getAddressFormation() 
		{
			var service = this;
			var errors = validateInputs(service);
			if (!_.isEmpty(errors)) {
				return {'errors' : errors};
			}

			var blockSize = bytesCalculator(service.blockSize, service.blockSizeUnit);
			var blockOffset = memoryBitsCalculator(service.blockSize, service.blockSizeUnit);
			var associativity = parseInt(service.associativity);
			var addressSize = parseInt(service.addressSize);
			var blocks = 0;
			var cacheSize = 0;
			if (!isUndefinedNullEmpty(service.cacheSize)) {
				cacheSize = bytesCalculator(service.cacheSize, service.cacheSizeUnit);
				blocks = service.blocks = cacheSize/blockSize;
			} else if (!isUndefinedNullEmpty(service.blocks)) {
				blocks = parseInt(service.blocks);
				cacheSize = service.cacheSize = blocks * blockSize;
			}			
			var blockIndex = associativity==0?0:log2(blocks/associativity);
			var tag = addressSize - blockIndex - blockOffset;
			if (tag < 0) {
				errors['addresssize'] = 'Address size is too small';

				return {'errors' : errors};
			}

			var result = {
				'blockOffset' 	: blockOffset,
				'tag'			: tag,
				'blockIndex'	: blockIndex,
				'cacheSize'		: cacheSize,
				'blocks'		: blocks,
				'addressSize'	: addressSize,
				'errors'		: errors
			};

			return result;			
		}


		function bytesCalculator(size, sizeUnit) 
		{
			var tmpSize = parseInt(size);
			var tmpUnitSize = parseInt(sizeUnit.value);

			return tmpSize*Math.pow(2, tmpUnitSize);
		}

		function memoryBitsCalculator(size, sizeUnit)
		{
			var tmpSize = parseInt(size);
			var tmpUnitSize = parseInt(sizeUnit.value);

			return log2(tmpSize) + tmpUnitSize;
		}

		function log2(n) {
			return Math.ceil((Math.log(n))/(Math.log(2)));
		}

		function isUndefinedNullEmpty(data) {
			return angular.isUndefined(data)||data==null||data=='';
		}

		function validateInputs(service) 
		{
			var errors = {};

			if (isUndefinedNullEmpty(service.cacheSize) && isUndefinedNullEmpty(service.blocks)) {
				errors['cachesize'] = 'You must provide a value for either cache size or number of blocks'; 
			}

			if (isUndefinedNullEmpty(service.blockSize)) {
				errors['blocksize'] = 'Block size is required';
			}

			if (isUndefinedNullEmpty(service.addressSize)) {
				errors['addresssize'] = 'Address size is required';
			}

			return errors;
		}

	}

})();
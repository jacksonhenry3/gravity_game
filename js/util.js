// Generic utility functions

function map(func, arr)
{
	// Replaces all elements arr[i] with func(arr[i])
	for(var i=0; i<arr.length; i++) {
		arr[i] = func(arr[i])
	}
	return arr
}

function join(func, arr1, arr2)
{
	// Joins two arrays of the same length using func
	// Returns an array such that arr[i] = func(arr1[i], arr2[i])
	
	if (arr1.length!=arr2.length)
	{
		throw "Arrays must be the same size";
	}
	
	arr = []
	for(var i=0; i<arr1.length; i++) {
		arr = arr.concat(func(arr1[i], arr2[i]))
	}
	return arr
}

function sum(arr)
{
	// Sums an array
	return arr.reduce(function(prevVal, currVal, currIndex, arr){return prevVal+currVal})
}
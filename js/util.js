// Generic utility functions

function map(func, arr)
{
	// Returns a new array arr2 such that arr2[i] = func(arr[i])
	newArr = []
	for(var i=0; i<arr.length; i++) {
		newArr[i] = func(arr[i])
	}
	return newArr
}

function join(func, arr1, arr2)
{
	// Joins two arrays of the same length using func
	// Returns an array such that arr[i] = func(arr1[i], arr2[i])
	
	if (arr1.length!=arr2.length)
	{
		throw "Arrays must be the same size";
	}
	
	newArr = []
	for(var i=0; i<arr1.length; i++) {
		newArr[i] = func(arr1[i], arr2[i])
	}
	return newArr
}

function sum(arr)
{
	// Sums an array of any length
	if(arr.length == 0){return(0)} 
	return arr.reduce(function(prevVal, currVal, currIndex, arr){return prevVal+currVal})
}
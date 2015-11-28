// Generic utility functions

function map(func, arr)
{
	// Replaces all elements arr[i] with func(arr[i])
	for(var i=0; i<arr.length; i++) {
		arr[i] = func(arr[i])
	}
	return arr
}
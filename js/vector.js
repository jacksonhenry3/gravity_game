function vector (vals) {
	this.length = 2;
	this.x      = vals[0];
	this.y      = vals[1];
	this.vals   = vals

	if (vals.length === 3)
	{
		this.length = 3;
		this.z = vals[2];
	}

	this.add = function(v)
	{
		addElement = function(x,y){return x+y}
		newVals = join(addElement, this.vals, v.vals)
		return(new vector(newVals))
	};

	this.subtract = function(v)
	{
		subtractElement = function(x,y){return x-y}
		newVals = join(subtractElement, this.vals, v.vals)
		return(new vector(newVals))
	};

	this.scalarAdd = function(n)
	{
		return(new vector(map(
			function(x){return x+n},
			this.vals)))
	}
	 
	this.scale = function(n)
	{
		return(new vector(map(
			function(x){return x*n},
			this.vals)))
	}

	this.dot = function(v)
	{
		function mulElement(x,y) {return x*y}
		return(sum(join(mulElement, this.vals, v.vals)))
	};

	this.magnitude = function()
	{
		return(Math.sqrt(this.dot(this)));
	};

	this.norm = function()
	{
		return(this.scale(1/this.magnitude()));
	};
	
	this.project = function(v)
	{
		// Projects this onto v
		return(this.dot(v.norm()))
	};
	
	this.limit = function(maxMag)
	{
		if(maxMag < 0) {
			throw "maxMag must be a nonnegative number"
		}
		// Limits the magnitude of this to maxMag
		currMag = this.magnitude()
		if(currMag != 0 && currMag > maxMag) {
			return this.scale(maxMag/currMag);
		}
		return this;
	};
}

function randomVector(dim)
{
	if (dim != (2 || 3))
		{
			throw "Vectors must be 2 or 3 dimensions";
		};
	var a  = Math.random()*2-1,
	    b  = Math.random()*2-1,
		rv = new vector([a,b]);
	if (dim == 3)
	{
		var c  = Math.random()*2-1,
			rv = new vector([a,b,c]);
	}
	return(rv)
};

function zeroVector(dim)
{
	var v = new vector([0,0]);
	if (dim === 3)
	{
		v = new vector([0,0,0])
	};
	return(v)
}

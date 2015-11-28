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
	 
	this.scalarMul = function(n)
	{
		return(new vector(map(
			function(x){return x*n},
			this.vals)))
	}

	this.dot = function(v)
	{
		if (this.length!=v.length)
		{
			throw "Vectors must be the same size";
		}
		var total = this.x*v.x+this.y*v.y;
		if (this.length ===3)
		{
			total+=this.z*v.z;
		}
		return(total);
	};

	this.scale = function(scale)
	{
		dx = this.x*scale;
		dy = this.y*scale;
		answer = new vector([dx,dy])
		if (this.length===3)
		{
			dz = this.z*scale;
			answer = new vector([dx,dy,dz])
		}
		return(answer);
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
		// Limits the magnitude of this to maxMag
		
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


var latex_to_js = function(input) {

	var init, fraction, square_root, nth_root, nth_power, sin, cos, tan, log, ln, arcsin, arccos, arctan, functionFramework, convert_others;

	init = function() {
		var st1 = input;
		st1 = st1.replace(/\s/g, "");

		st1 = st1.replace(/\\times/g, "*");
		st1 = st1.replace(/\\div/g, "/");

		//pi
		st1 = st1.replace(/([0-9a-zA-Z\.]+)\\pi/g, "$1*3.141592653589793238");
		st1 = st1.replace(/\\pi([0-9a-zA-Z\.]+)/g, "3.141592653589793238*$1");
		st1 = st1.replace(/([0-9a-zA-Z\.]+)\\pi([0-9a-zA-Z\.]+)/g, "$1*3.141592653589793238*$2");
		st1 = st1.replace(/\\pi/g, "3.141592653589793238");


		st1 = fraction(st1);
		st1 = square_root(st1);
		st1 = nth_root(st1);
		st1 = nth_power(st1);
		st1 = sin(st1);
		st1 = tan(st1);
		st1 = cos(st1);
		st1 = log(st1);
		st1 = ln(st1);
		st1 = arcsin(st1);
		st1 = arccos(st1);
		st1 = arctan(st1);

		//clean up brackets
		st1 = st1.replace(/\\left\(/g, "(");
		st1 = st1.replace(/\\right\)/g, ")");
		return st1;
	};

	fraction = function(input) {
		while (input.search(/\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/) >= 0) {

			input = input.replace(/\\frac\{(((?![\{\}]).)*)\}\{(((?![\{\}]).)*)\}/g, "($1)/($3)");
		}

		if (input.search(/\\frac/) >= 0) {
			input = convert_others("fraction", input);
		}

		return input;
	};

	square_root = function(input) {
		while (input.search(/\\sqrt\{(((?![\{\}]).)*)\}/) >= 0) {

			input = input.replace(/\\sqrt\{(((?![\{\}]).)*)\}/g, "sqrt($1)");
		}

		if (input.search(/\\sqrt\{/) >= 0) {
			input = convert_others("square root", input);
		}

		return input;
	};

	nth_root = function(input) {
		while (input.search(/\\sqrt\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/) >= 0) {

			input = input.replace(/\\sqrt\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/g, "pow($3,1/$1)");
		}
		if (input.search(/\\sqrt\[/) >= 0) {
			input = convert_others("nth root", input);
		}
		return input;
	};

	nth_power = function(input) {
		//first case: single number with curly bracket power
		while (input.search(/([0-9a-zA-Z\.]+)\^\{(((?![\{\}]).)*)\}/) >= 0) {

			input = input.replace(/([0-9a-zA-Z\.]+)\^\{(((?![\{\}]).)*)\}/g, "pow($1,$2)");
		}
		//second case: single number without curly bracket
		while (input.search(/([0-9a-zA-Z\.]+)\^([0-9a-zA-Z\.]+)/) >= 0) {

			input = input.replace(/([0-9a-zA-Z\.]+)\^([0-9a-zA-Z\.]+)/g, "pow($1,$2)");
		}

		//third case: bracket number without curly bracket power
		while (input.search(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^([0-9a-zA-Z\.]+)/) >= 0) {

			input = input.replace(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^([0-9a-zA-Z\.]+)/g, "pow($1,$2)");
		}

		//forth case: bracket number with curly bracket power
		while (input.search(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^\{(((?![\{\}]).)*)\}/) >= 0) {

			input = input.replace(/\\left\(([0-9a-zA-Z\.\+\*\-\\]+)\\right\)\^\{(((?![\{\}]).)*)\}/g, "pow($1,$2)");
		}

		//fifth case: bracket number with some brackets and division sign, with curly bracket power
		while (input.search(/\\left\(([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\\right\)\^\{(((?![\{\}]).)*)\}/) >= 0) {

			input = input.replace(/\\left\(([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\\right\)\^\{(((?![\{\}]).)*)\}/g, "pow($1,$2)");
		}

		if (input.search(/\^/) >= 0) {
			input = convert_others("nth power", input);
		}
		return input;
	};

	sin = function(input) {

		return functionFramework("sin", input);
	};

	tan = function(input) {
		return functionFramework("tan", input);
	};

	cos = function(input) {
		return functionFramework("cos", input);
	};

	ln = function(input) {
		return functionFramework("ln", input);
	};

	log = function(input) {
		return functionFramework("log", input);
	};

	arcsin = function(input) {
		return functionFramework("arcsin", input);
	};

	arctan = function(input) {
		return functionFramework("arctan", input);
	};

	arccos = function(input) {
		return functionFramework("arccos", input);
	};

	functionFramework = function(func, input) {
		var pat1 = new RegExp("\\\\" + func + "\\\\left\\(([0-9a-zA-Z\\.\\+\\*\\-\\\\\\(\\)\\/]+)\\\\right\\)");
		//eg: /\\sin\\left\(([0-9a-zA-Z\.\+\*\-\\\(\)\/]+)\\right\)/

		while (input.search(pat1) >= 0) {

			input = input.replace(pat1, func + "($1)");
		}
		var pat2 = new RegExp("\\\\" + func + "([0-9a-zA-Z]+)");
		//eg:  /\\sin([0-9a-zA-Z]+)/:

		while (input.search(pat2) >= 0) {

			input = input.replace(pat2, func + "($1)");
		}

		var pat3 = new RegExp("\\\\" + func);
		//eg:  /\\sin/
		if (input.search(pat3) >= 0) {
			input = convert_others(func, input);
		}

		return input;
	};

	convert_others = function(func, input) {

		var temp_input, arr, closest_pos, func_pos, frac_pos, sqrt_pos, root_pos, pow_pos;
		switch(func) {
			case "fraction":
			if(input.match(/\\frac.*/)){
				temp_input = input.match(/\\frac.*/)[0];
				func_pos = temp_input.search(/\\frac/);
			}
				break;
			case "square root":
			if(input.match(/\\sqrt\{.*/)){
				temp_input = input.match(/\\sqrt\{.*/)[0];
				func_pos = temp_input.search(/\\sqrt\{/);
				}
				break;
			case "nth root":
			if(input.match(/\\sqrt\[.*/)){
				temp_input = input.match(/\\sqrt\[.*/)[0];
				func_pos = temp_input.search(/\\sqrt\[/);
				}
				break;
			case "nth power":
			if(input.match(/\^.*/)){
				temp_input = input.match(/\^.*/)[0];
				func_pos = temp_input.search(/\^/);
			}
				break;
			case "sin":
			if(input.match(/\\sin\\left\(.*/)){
				temp_input = input.match(/\\sin\\left\(.*/)[0];

				func_pos = temp_input.search(/\\sin\\left\(/);
				}
				break;
			case "tan":
			if(input.match(/\\tan\\left\(.*/)){
				temp_input = input.match(/\\tan\\left\(.*/)[0];
				func_pos = temp_input.search(/\\tan\\left\(/);
				}
				break;
			case "cos":
			if(input.match(/\\cos\\left\(.*/)){
				temp_input = input.match(/\\cos\\left\(.*/)[0];
				func_pos = temp_input.search(/\\cos\\left\(/);
				}
				break;
			case "ln":
			if(input.match(/\\ln\\left\(.*/)){
				temp_input = input.match(/\\ln\\left\(.*/)[0];
				func_pos = temp_input.search(/\\ln\\left\(/);
				}
				break;
			case "log":
			if(input.match(/\\log\\left\(.*/)){
				temp_input = input.match(/\\log\\left\(.*/)[0];
				func_pos = temp_input.search(/\\log\\left\(/);
				}
				break;
			case "arcsin":
			if(input.match(/\\arcsin\\left\(.*/)){
				temp_input = input.match(/\\arcsin\\left\(.*/)[0];
				func_pos = temp_input.search(/\\arcsin\\left\(/);
				}
			case "arccos":
			if(input.match(/\\arccos\\left\(.*/)){
				temp_input = input.match(/\\arccos\\left\(.*/)[0];
				func_pos = temp_input.search(/\\arccos\\left\(/);
				}
			case "arctan":
			if(input.match(/\\arctan\\left\(.*/)){
				temp_input = input.match(/\\arctan\\left\(.*/)[0];
				func_pos = temp_input.search(/\\arctan\\left\(/);
				}
				break;
			default:
				return;
		}

		frac_pos = temp_input.search(/\\frac/);
		sqrt_pos = temp_input.search(/\\sqrt\{/);
		root_pos = temp_input.search(/\\sqrt\[/);
		pow_pos = temp_input.search(/\^/);
		sin_pos = temp_input.search(/\\sin\\left\(/);
		tan_pos = temp_input.search(/\\tan\\left\(/);
		cos_pos = temp_input.search(/\\cos\\left\(/);
		log_pos = temp_input.search(/\\log\\left\(/);
		ln_pos = temp_input.search(/\\ln\\left\(/);
		arcsin_pos = temp_input.search(/\\arcsin\\left\(/);
		arccos_pos = temp_input.search(/\\arccos\\left\(/);
		arctan_pos = temp_input.search(/\\arctan\\left\(/);

		arr = [frac_pos, root_pos, sqrt_pos, pow_pos, sin_pos, tan_pos, cos_pos, log_pos, ln_pos, arcsin_pos, arctan_pos, arccos_pos];
		arr.sort(function(a, b) {
			return b - a;
		});
		//desc order



		closest_pos = arr[arr.indexOf(0)-1];



		if (closest_pos <= 0 || closest_pos===undefined) {


			//throw ("syntax error");
		}

		switch(closest_pos) {
			case frac_pos:
				input = fraction(input);
				break;
			case sqrt_pos:
				input = square_root(input);
				break;
			case root_pos:
				input = nth_root(input);
				break;
			case pow_pos:
				input = nth_power(input);
				break;
			case sin_pos:
			console.log('yote');
				input = sin(input);

				break;
			case tan_pos:
				input = tan(input);
				break;
			case cos_pos:
				input = cos(input);
				break;
			case log_pos:
				input = log(input);
				break;
			case ln_pos:
				input = ln(input);
				break;
			case arcsin_pos:
				input = arcsin(input);
				break;
			case arccos_pos:
				input = arccos(input);
				break;
			case arctan_pos:
				input = arctan(input);
				break;
			default:

		}

		return input;
	};

try{
	cleanUpString = init();
	cleanUpString = cleanUpString.replace(/e/g, "2.718281828459045");
	cleanUpString = cleanUpString.replace(/\)x/g, ")*x");
	cleanUpString = cleanUpString.replace(/\)y/g, ")*y");
	cleanUpString = cleanUpString.replace(/\)\(/g, ")*(");
	cleanUpString = cleanUpString.replace(/0x/g, "0*x");
	cleanUpString = cleanUpString.replace(/1x/g, "1*x");
	cleanUpString = cleanUpString.replace(/2x/g, "2*x");
	cleanUpString = cleanUpString.replace(/3x/g, "3*x");
	cleanUpString = cleanUpString.replace(/4x/g, "4*x");
	cleanUpString = cleanUpString.replace(/5x/g, "5*x");
	cleanUpString = cleanUpString.replace(/6x/g, "6*x");
	cleanUpString = cleanUpString.replace(/7x/g, "7*x");
	cleanUpString = cleanUpString.replace(/8x/g, "8*x");
	cleanUpString = cleanUpString.replace(/9x/g, "9*x");
	cleanUpString = cleanUpString.replace(/x\(/g, "x*(");
	cleanUpString = cleanUpString.replace(/0y/g, "0*y");
	cleanUpString = cleanUpString.replace(/1y/g, "1*y");
	cleanUpString = cleanUpString.replace(/2y/g, "2*y");
	cleanUpString = cleanUpString.replace(/3y/g, "3*y");
	cleanUpString = cleanUpString.replace(/4y/g, "4*y");
	cleanUpString = cleanUpString.replace(/5y/g, "5*y");
	cleanUpString = cleanUpString.replace(/6y/g, "6*y");
	cleanUpString = cleanUpString.replace(/7y/g, "7*y");
	cleanUpString = cleanUpString.replace(/8y/g, "8*y");
	cleanUpString = cleanUpString.replace(/9y/g, "9*y");
	cleanUpString = cleanUpString.replace(/y\(/g, "y*(");
	cleanUpString = cleanUpString.replace(/xy/g, "x*y");
	cleanUpString = cleanUpString.replace(/yx/g, "y*x");
	cleanUpString = cleanUpString.replace(/0\(/g, "0*(");
	cleanUpString = cleanUpString.replace(/1\(/g, "1*(");
	cleanUpString = cleanUpString.replace(/2\(/g, "2*(");
	cleanUpString = cleanUpString.replace(/3\(/g, "3*(");
	cleanUpString = cleanUpString.replace(/4\(/g, "4*(");
	cleanUpString = cleanUpString.replace(/5\(/g, "5*(");
	cleanUpString = cleanUpString.replace(/6\(/g, "6*(");
	cleanUpString = cleanUpString.replace(/7\(/g, "7*(");
	cleanUpString = cleanUpString.replace(/8\(/g, "8*(");
	cleanUpString = cleanUpString.replace(/9\(/g, "9*(");
	cleanUpString = cleanUpString.replace(/arcsin/g, "Math.a#s#i#n");
	cleanUpString = cleanUpString.replace(/arccos/g, "Math.a#c#o#s");
	cleanUpString = cleanUpString.replace(/arctan/g, "Math.a#t#a#n");
	cleanUpString = cleanUpString.replace(/sin/g, "Math.sin");
	cleanUpString = cleanUpString.replace(/cos/g, "Math.cos");
	cleanUpString = cleanUpString.replace(/tan/g, "Math.tan");
	cleanUpString = cleanUpString.replace(/pow/g, "Math.pow");
	cleanUpString = cleanUpString.replace(/a#s#i#n/g, "asin");
	cleanUpString = cleanUpString.replace(/a#c#o#s/g, "acos");
	cleanUpString = cleanUpString.replace(/a#t#a#n/g, "atan");
	cleanUpString = cleanUpString.replace(/sqrt/g, "Math.sqrt");
	cleanUpString = cleanUpString.replace(/log/g, "Math.log10");
	cleanUpString = cleanUpString.replace(/ln/g, "Math.log");
	cleanUpString = cleanUpString.replace(/\\Math/g, "Math");
	cleanUpString = cleanUpString.replace(/xMath/g, "x*Math");
	cleanUpString = cleanUpString.replace(/yMath/g, "y*Math");
	cleanUpString = cleanUpString.replace(/0Math/g, "0*Math");
	cleanUpString = cleanUpString.replace(/1Math/g, "1*Math");
	cleanUpString = cleanUpString.replace(/2Math/g, "2*Math");
	cleanUpString = cleanUpString.replace(/3Math/g, "3*Math");
	cleanUpString = cleanUpString.replace(/4Math/g, "4*Math");
	cleanUpString = cleanUpString.replace(/5Math/g, "5*Math");
	cleanUpString = cleanUpString.replace(/6Math/g, "6*Math");
	cleanUpString = cleanUpString.replace(/7Math/g, "7*Math");
	cleanUpString = cleanUpString.replace(/8Math/g, "8*Math");
	cleanUpString = cleanUpString.replace(/9Math/g, "9*Math");
	cleanUpString = cleanUpString.replace(/\)Math/g, ")*Math");

	return cleanUpString;
}catch{
	throw('syntax error');
}

};

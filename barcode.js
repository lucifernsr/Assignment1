"use strict";

/*
 *
 * MCD4290 - Assignment 01 (2017 T3)
 * 
 * Author(s):   Team 02
 *              Nuwan Sanjeewa, Raidh Ramzee, Randil Silva, Ujitha Ruwan
 *
 * This is the final submission file for the Assignment 01, the barcode reader app
 * which contains the key functions required to obtain the number encoded in the 
 * given barcode following the EAN-13 barcode standard from the binary string with
 * the length being 95 (or less) and outputs an object containing following properties.
 *      #Barcode         -  A string containing the barcode message and the parity digit,
 *                          which the user would see as it is.
 *      #Message         -  A string containing an appropriate message specifying the 
 *                          guards present/missing, which the user would see as it is.
 *      #checksumValid   -  A bolean true/false value with reference to the validity of
 *                          the checksum value obtained from the calculations, which the
 *                          user would see as a colored circle (green for valid, red for
 *                          invalid).
 *
 * The index function is "decodeBarcodeFromAreas()" and is called in the line #350 of the
 * app.js file and assigned to the "decodeResult" variable. Then that variable have been
 * used as a reference when giving the outputs in the web-app.
 *
 * There is one (or more) functions defined for the each sub-part of the coding component
 * and they're called appropriately inside the index function to output the result object.
 * Minimum number of in-between variables have been used in order to reduce the run-time.
 *
*/

//R1.1 - Mapped area-pattern strings.
var areaPatternsRef = {    
    // EAN-13 reference table have been declared in the main scope so that they could be used from any function.
    leftOdd : ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"],
    leftEven : ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"],
    right : ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"]
};

//R2.1 - Mapped parity-pattern strings.
var parityPatternsRef = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

//R1.2 - Extracted output character strings and guards.
var areaSorted = {
    // A structure have been set up in the main scope to hold the extracted are-pattern strings so that they could be used from any function.
    areaPatterns : {
        One : "",    
        Two : "",
        Three : "",
        Four : "",
        Five : "",
        Six : "",
        Seven : "",
        Eight : "",
        Nine : "",
        Ten : "",
        Eleven : "",
        Twelve : ""
    },
        
    leftGuard : "",
    centerGuard : "",
    rightGuard : ""
};

// Index function.
function decodeBarcodeFromAreas(areas) {
    var result = {
        barcode: "123456", 
        message: "No middle guard", 
        checksumValid: false
    };

    // Save all ranges of area patterns in areaSorted global object.
    extractAreaPatternStrings(areas);
    
    // Read all the guards and output an error message in the results object if not found.
    result.message = detectGuards(areaSorted);
    
    // Convert the area pattern strings obtained into digits and save them in the results object.
    result.barcode = convertToDigits(areaSorted);
    
    // Get the parity digit and add it to the start of the barcode string.
    var barcodeString = determineParityDigit(areaSorted) + result.barcode
    result.barcode = barcodeString;
    
    // Get the check digit and save it in another variable.
    var checkDigit = calculateChecksum(barcodeString);
    
    // Get the checksum validity and stores in the result object.
    result.checksumValid = checkDigitValidity(barcodeString, checkDigit)
    
    // Return the result object which contains barcode, checksum validity and an error message if any.
    return result;
}

// R1.2 - Function for extracting area pattern strings and saving them in the object defined before.
function extractAreaPatternStrings(areas) {
    // Check if the left guard is there.
    if (areas.substr(0,3) === "101") {
		areaSorted.leftGuard = "101"; // Save the left guard if any.
		{
            // Save the following six area-patterns.
            areaSorted.areaPatterns.One = areas.substr(3,7);
            areaSorted.areaPatterns.Two = areas.substr(10,7);
            areaSorted.areaPatterns.Three = areas.substr(17,7);
            areaSorted.areaPatterns.Four = areas.substr(24,7);
            areaSorted.areaPatterns.Five = areas.substr(31,7);
            areaSorted.areaPatterns.Six = areas.substr(38,7);
        }
		
        // Checking if the center guard is there.
		if (areas.substr(45,5) === "01010") {
			areaSorted.centerGuard = "01010"; // Save the center guard if any.
			
            {
                // Save the following six area-patterns.
				areaSorted.areaPatterns.Seven = areas.substr(50,7);
				areaSorted.areaPatterns.Eight = areas.substr(57,7);
				areaSorted.areaPatterns.Nine = areas.substr(64,7);
				areaSorted.areaPatterns.Ten = areas.substr(71,7);
				areaSorted.areaPatterns.Eleven = areas.substr(78,7);
				areaSorted.areaPatterns.Twelve = areas.substr(85,7);
			}
			
            // Checking if the right guard is there.
			if (areas.substr(92,3) === "101") {
				areaSorted.rightGuard = "101"; // Save the right guard if any.
			}
		}
        
        // No center guard.
        else {
            
            {
                // Save the following six area-patterns.
                areaSorted.areaPatterns.Seven = areas.substr(45,7);
				areaSorted.areaPatterns.Eight = areas.substr(52,7);
				areaSorted.areaPatterns.Nine = areas.substr(59,7);
				areaSorted.areaPatterns.Ten = areas.substr(66,7);
				areaSorted.areaPatterns.Eleven = areas.substr(73,7);
				areaSorted.areaPatterns.Twelve = areas.substr(80,7);
            }
            
            // Checking if the right guard is there.
            if (areas.substr(87,3) === "101") {
				areaSorted.rightGuard = "101"; // Save the right guard if any.
			}
        }
		
		}
	// No left guard
	else {
        // Save the following six area-patterns.
		areaSorted.areaPatterns.One = areas.substr(0,7);
		areaSorted.areaPatterns.Two = areas.substr(7,7);
		areaSorted.areaPatterns.Three = areas.substr(14,7);
		areaSorted.areaPatterns.Four = areas.substr(21,7);
		areaSorted.areaPatterns.Five = areas.substr(28,7);
		areaSorted.areaPatterns.Six = areas.substr(35,7);
		
		// Checking if the center guard is there. 
		if (areas.substr(42,5) === "01010") {
			areaSorted.centerGuard = "01010"; // Save the center guard if any.
            
            {
                // Save the following six area-patterns.
				areaSorted.areaPatterns.Seven = areas.substr(47,7);
				areaSorted.areaPatterns.Eight = areas.substr(54,7);
				areaSorted.areaPatterns.Nine = areas.substr(61,7);
				areaSorted.areaPatterns.Ten = areas.substr(68,7);
				areaSorted.areaPatterns.Eleven = areas.substr(75,7);
				areaSorted.areaPatterns.Twelve = areas.substr(82,7);
			}
            
            // Checking if the right guard is there.
            if (areas.substr(89,3) === "101") {
				areaSorted.rightGuard = "101"; // Save the right guard if any.
			}
		}
        
        // No center guard.
        else {
            {
                // Save the following six area-patterns.
				areaSorted.areaPatterns.Seven = areas.substr(42,7);
				areaSorted.areaPatterns.Eight = areas.substr(49,7);
				areaSorted.areaPatterns.Nine = areas.substr(56,7);
				areaSorted.areaPatterns.Ten = areas.substr(63,7);
				areaSorted.areaPatterns.Eleven = areas.substr(70,7);
				areaSorted.areaPatterns.Twelve = areas.substr(77,7);
			}
            
            // Checking if the right guard is there.
            if (areas.substr(84,3) === "101") {
				areaSorted.rightGuard = "101"; // Save the right guard if any.
        }
	}
    }
}

// R1.3 - Function for detecting the guards and outputting a message.
function detectGuards(areaSorted) {
    var errorMessage = ""; // A private variable defined to hold a error message.
    
    // Following conditional statements are used to check for every possible scenario with reference to the guards detected/missing.
    if (areaSorted.leftGuard === "" && areaSorted.centerGuard === "" && areaSorted.rightGuard === "") {
        errorMessage = "All three guards are missing.";
    }
    else if (areaSorted.leftGuard === "" && areaSorted.centerGuard === "") {
        errorMessage = "Both left and center guard is missing.";
    }
    else if (areaSorted.leftGuard === "" && areaSorted.rightGuard === "") {
        errorMessage = "Both left and right guard is missing.";
    }
    else if (areaSorted.centerGuard === "" && areaSorted.rightGuard === "") {
        errorMessage = "Both center and right guard is missing.";
    }
    else if (areaSorted.leftGuard === "") {
        errorMessage = "Left guard is missing.";
    }
    else if (areaSorted.centerGuard === "") {
        errorMessage = "Center guard is missing.";    
    }
    else if (areaSorted.rightGuard === "") {
        errorMessage = "Right guard is missing.";    
    }
    else {
        errorMessage = "All three guards are detected."
    }
    
    return errorMessage; // Return the error message modified in the above conditional statements.
}

// R1.4 - Function for obtaining the digits by refferring the mapped area-pattern strings.
function convertToDigits(areaSorted) {
    // Read the first area-pattern and saves it in a private variable to use throughout the function.
    var parity = getParity(areaSorted.areaPatterns.One);
    
    // Check the barcode is right-to-left and flip the data if so.
    if (parity === "even") {
        flipAreaPatterns(areaSorted);
    }
    
    // Save area patterns in an array for easy refference.
    var tempAreaPatterns = [0];
    var i = 1;
    for (var prop in areaSorted.areaPatterns) {
        tempAreaPatterns[i] = areaSorted.areaPatterns[prop];
        i++;
    }
    
    // Loop through the area patterns to determine digits.
    var tempDigits = [0];
    
    // Check the leftmost digit.
    for (var j = 0; j <= areaPatternsRef.leftOdd.length; j++) {
        if (tempAreaPatterns[0] === areaPatternsRef.leftOdd[j]) {
            tempDigits[0] = j;
        }
    }
    
    // Loop through the rest of left digits.
    for (var i = 1; i < 7; i++) {
		// Loop through the Left-Odd data to determine if the area is from that.
        for (var j = 0; j <= areaPatternsRef.leftOdd.length; j++) {
            if (tempAreaPatterns[i] === areaPatternsRef.leftOdd[j]) {
                tempDigits[i] = j;
            }
        }
	
		// Loop through the Left-Even data to determine if the area is from that.
		for (var j = 0; j <= areaPatternsRef.leftEven.length; j++) {
            if (tempAreaPatterns[i] === areaPatternsRef.leftEven[j]) {
                tempDigits[i] = j;
            }
        }
    }
    
    // Loop through all the Right digits.
    for (var i = 7; i<= (tempAreaPatterns.length - 1); i++) {   
        for (var j = 0; j <= areaPatternsRef.right.length; j++) {
            if (tempAreaPatterns[i] === areaPatternsRef.right[j]) {
                tempDigits[i] = j;
            }
        }
    }
    
    // Saving the digits in a string for returning.
    var digits = "";
    for (var k = 1; k < tempDigits.length; k++) {
        digits += `${tempDigits[k]}`;
    }
    return digits;
}

// R1.4 - Function for obtaining the parity of a given area pattern.
function getParity(areaPattern) {
    // Save each character of an area pattern given in an array as separate elements.
    areaPattern = areaPattern.split("");
    
    var sum = 0; // A variable declared to hold the running sum of the area pattern characters.
    for (var i = 0; i < areaPattern.length; i++) {
        sum += parseInt(areaPattern[i], 10); // Adding the value of the character to the running sum.
    }
    
    var parity; // A variable declared to hold the odd/even value as a string.
    // Following conditional statements checks the running sum and determines if it's odd/even.
    if ((sum % 2) === 0) {
        parity = "even";
    }
    else {
        parity = "odd";
    }
    
    return parity; //Return the parity string modified to the function call.
}

// R1.4 - Function for flipping the obtained barcode area patterns in case of a barcode read backwards.
function flipAreaPatterns(areaSorted) {
    var tempAreaString = ""; // A variable declared to hold the area-pattern-string for the flipping purpose.
    
    // Following code block loops through all area-patterns and saves them in the above variable.
    for (var props in areaSorted.areaPatterns) {
        tempAreaString += areaSorted.areaPatterns[props];
    }
    
    // Reverse the string by using array-reverse methods.
	var newAreaString = tempAreaString.split("").reverse().join("");
    
    // Following code block saves the reversed area-patterns in a temporary array.
	var newArray = [];
	for (var k = 0; k < 12; k++) {
		newArray[k] = newAreaString.substr(k*7,7);
	}
	
    // Following code block modifies the area-patterns object.
	var l = 0;
	for (var props2 in areaSorted.areaPatterns) {
        areaSorted.areaPatterns[props2] = newArray[l];
		l++;
    }
}

// R2.2 - Function for calculating the parity digit.
function determineParityDigit(areaSorted) {
    // Following code block saves the first six area-patterns in temporary array to use inside the funtion.
    var tempLeftAreaPatterns = [];
    var i = 0; // A counter variable defined to use to reference the position of the temporary array.
    for (var props in areaSorted.areaPatterns) {
		tempLeftAreaPatterns[i] = areaSorted.areaPatterns[props];
		i++;
		if (i > 5) {
			break; // A break statement has been used to save only the first six area-patterns.
		}
	}
	
    // Following code block uses the "getParity()" function to create the parity-pattern.
    var parityPattern = "";
    var parityVal;
    for (var props in tempLeftAreaPatterns) {
        parityVal = getParity(tempLeftAreaPatterns[props]);
        
        if (parityVal === "odd") {     
            parityPattern += "L";
        } else if (parityVal === "even") {
            parityPattern += "G";
        }
    }
    
    // Following code block loops through the parity-patternss and get the corresponding value.
    var parityDigit; // A variable declared to hold the parity value.
    var parityError; // A variable declared to hold the status of parity error.
    for (var k = 0; k < parityPatternsRef.length; k++) {
        if (parityPattern === parityPatternsRef[k]) {
            parityDigit = k; // Stores the parity digit.
            parityError = false;
        }
    }
    if (parityError !== false) {
        console.log("Parity Error!"); // Logs an error to the JS console if the parity contains an error.
    }
    
    return parityDigit.toString(); //Return the parity valueto the function call.
}

// R2.3 - Function for calculating the checksum value.
function calculateChecksum(barcodeString) {
    // Saves the barcode inside an array character-by-character and reverses it.
    var barcodeArray = barcodeString.split("");
    barcodeArray.reverse();
    
    var sum = 0; // A variable declared to store the running sum.
    
    // Modifies the running sum for odd-digits.
    for (var i = 1; i <= 12; i+=2) {
        sum += barcodeArray[i] * 3;
    }
    
    // Modifies the running sum for even-digits.
    for (var j = 2; j <= 12; j+=2) {
        sum += barcodeArray[j] * 1 
    }
    
    // Stores the running sum in the temporary array.
    barcodeArray[0] = sum;
    
    // Calculates the checksum value.
    var roundedSum = (parseInt((sum/10).toString(),10) + 1) * 10;
	var checkDigit = roundedSum - sum;
    
    return checkDigit; //Return the checksum digit calculated to the function call.
}

// R2.4 - Function for checking the check digit validity.
function checkDigitValidity(barcodeString, checkDigit) {
    // Stores the right-most digit in a separate variable to use throughout the function.
    var rightMostDigit = Number(barcodeString.substr(12,1));
    var validity; // A variable defined to hold the validity of the checksum.
    if (rightMostDigit === checkDigit) {
        validity = true;
    }
    else {
        validity = false;
    }
    return validity; //Return the checksum validity obtained to the function call.
}

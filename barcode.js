"use strict";

//R1.1 - Mapped area-pattern strings.
var areaPatternsRef = {
    leftOdd : ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"],
    leftEven : ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"],
    right : ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"]
};

//R2.1 - Mapped parity-pattern strings.
var parityPatternsRef = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

//R1.2 - Extracted output character strings and guards.
var areaSorted = {
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

// R1.2 - Function for extracting area pattern strings and saving them in the global object.
function extractAreaPatternStrings(areas) {
    // Check if the left guard is there.
    if (areas.substr(0,3) === "101") {
		areaSorted.leftGuard = "101";
		{
            areaSorted.areaPatterns.One = areas.substr(3,7);
            areaSorted.areaPatterns.Two = areas.substr(10,7);
            areaSorted.areaPatterns.Three = areas.substr(17,7);
            areaSorted.areaPatterns.Four = areas.substr(24,7);
            areaSorted.areaPatterns.Five = areas.substr(31,7);
            areaSorted.areaPatterns.Six = areas.substr(38,7);
        }
		
        // Checking if the center guard is there.
		if (areas.substr(45,5) === "01010") {
            
			areaSorted.centerGuard = "01010";
			{
				areaSorted.areaPatterns.Seven = areas.substr(50,7);
				areaSorted.areaPatterns.Eight = areas.substr(57,7);
				areaSorted.areaPatterns.Nine = areas.substr(64,7);
				areaSorted.areaPatterns.Ten = areas.substr(71,7);
				areaSorted.areaPatterns.Eleven = areas.substr(78,7);
				areaSorted.areaPatterns.Twelve = areas.substr(85,7);
			}
			
            // Checking if the right guard is there.
			if (areas.substr(92,3) === "101") {
				areaSorted.rightGuard = "101";
			}
		}
        
        // No center guard.
        else {
            {
                areaSorted.areaPatterns.Seven = areas.substr(45,7);
				areaSorted.areaPatterns.Eight = areas.substr(52,7);
				areaSorted.areaPatterns.Nine = areas.substr(59,7);
				areaSorted.areaPatterns.Ten = areas.substr(66,7);
				areaSorted.areaPatterns.Eleven = areas.substr(73,7);
				areaSorted.areaPatterns.Twelve = areas.substr(80,7);
            }
            
            // Checking if the right guard is there.
            if (areas.substr(87,3) === "101") {
				areaSorted.rightGuard = "101";
			}
        }
		
		}
	// No left guard
	else {
		areaSorted.areaPatterns.One = areas.substr(0,7);
		areaSorted.areaPatterns.Two = areas.substr(7,7);
		areaSorted.areaPatterns.Three = areas.substr(14,7);
		areaSorted.areaPatterns.Four = areas.substr(21,7);
		areaSorted.areaPatterns.Five = areas.substr(28,7);
		areaSorted.areaPatterns.Six = areas.substr(35,7);
		
		// Checking if the center guard is there. 
		if (areas.substr(42,5) === "01010") {
			areaSorted.centerGuard = "01010";
            {
				areaSorted.areaPatterns.Seven = areas.substr(47,7);
				areaSorted.areaPatterns.Eight = areas.substr(54,7);
				areaSorted.areaPatterns.Nine = areas.substr(61,7);
				areaSorted.areaPatterns.Ten = areas.substr(68,7);
				areaSorted.areaPatterns.Eleven = areas.substr(75,7);
				areaSorted.areaPatterns.Twelve = areas.substr(82,7);
			}
            
            // Checking if the right guard is there.
            if (areas.substr(89,3) === "101") {
				areaSorted.rightGuard = "101";
			}
		}
        
        // No center guard.
        else {
            {
				areaSorted.areaPatterns.Seven = areas.substr(42,7);
				areaSorted.areaPatterns.Eight = areas.substr(49,7);
				areaSorted.areaPatterns.Nine = areas.substr(56,7);
				areaSorted.areaPatterns.Ten = areas.substr(63,7);
				areaSorted.areaPatterns.Eleven = areas.substr(70,7);
				areaSorted.areaPatterns.Twelve = areas.substr(77,7);
			}
            
            // Checking if the right guard is there.
            if (areas.substr(84,3) === "101") {
				areaSorted.rightGuard = "101";
        }
	}
    }
}

// R1.3 - Function for detecting the guards and outputting a message.
function detectGuards(areaSorted) {
    var errorMessage = "";
    if (areaSorted.leftGuard === "") {
        errorMessage = "No Left guard";    
    }
    else if (areaSorted.centerGuard === "") {
        errorMessage = "No Center guard";    
    }
    else if (areaSorted.rightGuard === "") {
        errorMessage = "No Right guard";    
    }
    else {
        errorMessage = "All the guards present."
    }
    
    return errorMessage;
}

// R1.4 - Function for obtaining the digits by refferring the mapped area-pattern strings.
function convertToDigits(areaSorted) {
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
    areaPattern = areaPattern.split("");
    var sum = 0;
    for (var i = 0; i < areaPattern.length; i++) {
        sum += parseInt(areaPattern[i], 10);
    }
    var parity;
    if ((sum % 2) === 0) {
        parity = "even";
    }
    else {
        parity = "odd";
    }
    return parity;
}

// R1.4 - Function for flipping the obtained barcode area patterns in case of a barcode read backwards.
function flipAreaPatterns(areaSorted) {
    var tempAreaPatterns = [];
    var i = 0;
    for (var props in areaSorted.areaPatterns) {
        tempAreaPatterns[i] = areaSorted.areaPatterns[props];
        i++;
    }
    i = 0;
    tempAreaPatterns.reverse();
    for (var props in areaSorted.areaPatterns) {
        areaSorted.areaPatterns[props] = tempAreaPatterns[i];
        i++;
    }
}

// R2.2 - Function for calculating the parity digit.
function determineParityDigit(areaSorted) {
    var tempLeftAreaPatterns = [];
    var i = 0;
    for (var props in areaSorted.areaPatterns) {
		tempLeftAreaPatterns[i] = areaSorted.areaPatterns[props];
		i++;
		if (i > 5) {
			break;
		}
	}
	
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
    
    var parityDigit = "";
    var parityError;
    for (var k = 0; k < parityPatternsRef.length; k++) {
        if (parityPattern === parityPatternsRef[k]) {
            parityDigit = k;
            parityError = false;
        }
    }
    if (parityError !== false) {
        console.log("Parity Error!")
    }
    return parityDigit.toString();
}

// R2.3 - Function for calculating the checksum value.
function calculateChecksum(barcodeString) {
    var barcodeArray = barcodeString.split("");
    barcodeArray.reverse();
    
    var sum = 0;
    for (var i = 1; i <= 12; i+=2) {
        sum += barcodeArray[i] * 3 
    }
    for (var j = 2; j <= 12; j+=2) {
        sum += barcodeArray[j] * 1 
    }
    barcodeArray[0] = sum;
    
    var roundedSum = (parseInt((sum/10).toString(),10) + 1) * 10;
	var checkDigit = roundedSum - sum;
    return checkDigit;
}

// R2.4 - Function for checking the check digit validity.
function checkDigitValidity(barcodeString, checkDigit) {
    var rightMostDigit = Number(barcodeString.substr(12,1));
    var validity;
    if (rightMostDigit === checkDigit) {
        validity = true;
    }
    else {
        validity = false;
    }
    return validity;
}

"use strict";

//R1.1 - Mapped area-pattern strings.
var areaPatternsRef = {
    leftOdd : {
        Zero : "0001101",
        One : "0011001",
        Two : "0010011",
        Three : "0111101",
        Four : "0100011",
        Five : "0110001",
        Six : "0101111",
        Seven : "0111011",
        Eight : "0110111",
        Nine : "0001011"
    },
    leftEven : {
        Zero : "0100111",
        One : "0110011",
        Two : "0011011",
        Three : "0100001",
        Four : "0011101",
        Five : "0111001",
        Six : "0000101",
        Seven : "0010001",
        Eight : "0001001",
        Nine : "0010111"
    },
    right : {
        Zero : "1110010",
        One : "1100110",
        Two : "1101100",
        Three : "1000010",
        Four : "1011100",
        Five : "1001110",
        Six : "1010000",
        Seven : "1000100",
        Eight : "1001000",
        Nine : "1110100"
    }
};

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
};

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
};

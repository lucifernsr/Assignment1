"use strict";

//R1.1 Mapping area-pattern strings to digits.
var areaPatterns = {
    leftOdd : {
        0 : "0001101",
        1 : "0011001",
        2 : "0010011",
        3 : "0111101",
        4 : "0100011",
        5 : "0110001",
        6 : "0101111",
        7 : "0111011",
        8 : "0110111",
        9 : "0001011"
    },
    leftEven : {
        0 : "0100111",
        1 : "0110011",
        2 : "0011011",
        3 : "0100001",
        4 : "0011101",
        5 : "0111001",
        6 : "0000101",
        7 : "0010001",
        8 : "0001001",
        9 : "0010111"
    },
    rightEven : {
        0 : "1110010",
        1 : "1100110",
        2 : "1101100",
        3 : "1000010",
        4 : "1011100",
        5 : "1001110",
        6 : "1010000",
        7 : "1000100",
        8 : "1001000",
        9 : "1110100"
    }
};

function decodeBarcodeFromAreas(areas)
{
    var result = {
        barcode: "123456", 
        message: "No middle guard", 
        checksumValid: false
    };

    
    
    return result;
}

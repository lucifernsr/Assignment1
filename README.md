# Assignment1
MCD4290 T3 - Assignment 01

Your decodeBarcodeFromAreas function will receive an string of 0s and 1s representing the bars and spaces read from the camera image.

Step 1: Mapping between digits, guards and binary string.
The first task will be to set up structures that maps area patterns (strings of seven zeroes and ones) into digits. You will also need a structure that maps parity patterns (strings of six characters) to the value for the first digit.

Step 2: Finding the guards and collecting sets of bits
Once you have the mapping represented, you should use knowledge of the position of guards and digits to write a loop that extracts the 7-character string for each digit from the input.

Step 3: Converting input data to digits
Now you should take each String of numbers and convert each of them into their corresponding digit, keeping track of the parity of each digit. Be careful to ensure that what you are treating as the left side is in fact the left side (and vice versa); See the EAN13 reference table provided to determine how to do this.

Step 4: Computing the parity digit
Once you have decoded the twelve digits directly encoded into the barcode, you should now be able to determine the parity digit and add this to the beginning of the barcode number.

Step 5: Checking validity (checksum)
Calculate the checksum using the information provided in the background and see if this matches the check digit.

Step 6: Printing and stopping
Your decodeBarcodeFromAreas function should return a JavaScript object containing three properties:
  ● “barcode”:        the (partial or full) String of digits in the barcode number. This should just contain digits with no spaces.
  ● “message”:        a short String containing a status or error message for the user.
  ● “checksumValid”:  a Boolean denoting whether the checksum was correct.

If you return an entire barcode (a string of length 13), the app will automatically stop scanning. It will then display a red or green dot   depending on whether the checksum for the barcode was valid. The app also displays the message you return.
You should ensure that every possible error state has a unique error message so that it is clear for the end user.

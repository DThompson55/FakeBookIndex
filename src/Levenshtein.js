
function findPotentialMatches(input, list, threshold) {
  // Create an array to store potential matches
  const potentialMatches = [];

  // Iterate over each item in the list
  for (let i = 0; i < list.length; i++) {
    const listItem = list[i];

    if (listItem == input){ // don't calculate the L-number for the original input value, which is part of the list
      continue;
    }
    
    if (Math.abs(input.length - listItem.length) > threshold ) continue;

    // Calculate the Levenshtein distance between the input and the current item
    const distance = levenshteinDistance(input, listItem);
    
    // Check if the distance is below the threshold
    if (distance <= threshold) {
      potentialMatches.push(listItem);
    }
  }
  
  return potentialMatches;
}

// Function to calculate the Levenshtein distance between two strings
function levenshteinDistance(str1, str2) {
  //console.log("L word",str1,str2);
  const m = str1.length;
  const n = str2.length;
  
  // Create a matrix to store the Levenshtein distances
  const matrix = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize the first row and column of the matrix
  for (let i = 0; i <= m; i++) {
    matrix[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }
  
  // Compute the Levenshtein distances
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,    // Deletion
          matrix[i][j - 1] + 1,    // Insertion
          matrix[i - 1][j - 1] + 1 // Substitution
        );
      }
    }
  }
//  console.log(str1, str2, matrix[m][n]);
  // Return the Levenshtein distance between the two strings
  return matrix[m][n];
}

module.exports = {findPotentialMatches}
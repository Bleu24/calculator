export const formatNumber = (num) => {
        
    if (isNaN(num) || !isFinite(num)) return num;
    

    num = Number(num);
    
    // Check if number has decimal 
    if (Number.isInteger(num)) return num.toString();
    
    // Format to 2 decimal places
    return num.toFixed(2).replace(/\.00$/, '');
};
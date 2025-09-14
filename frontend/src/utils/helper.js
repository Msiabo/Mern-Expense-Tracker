

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials ="";

    
    for(let i = 0;i < Math.min(words.length,2); i++){
        initials += words[i][0]
    }

    return initials.toUpperCase();
}
export const addThousandsSeperator = (num) => {
    if (num === null || num === undefined) return "0";

    const [intergerPart,fractionPart] = num.toString().split(".");
    const formattedInteger = intergerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionPart ? `${formattedInteger}.${fractionPart}` : formattedInteger;
}
export const prepareExpenseBarChartData=(data = []) => {
    const charData = data.map((item) => ({
        category : item?.category,
        amount : item?.amount
    }));

    return charData;
};
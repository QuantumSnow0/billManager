
export const convert = (x, y, logic) => {
    const num1 = parseInt(x);
    switch (logic) {
        case "plus":
            return (num1 + y).toString();
        case "minus":
            return (num1 - y).toString();
            
    }
}
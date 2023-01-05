export const getImageUrlList = () => {
    let result = [];

    for(let i = 1; i <= 72; i++){
        const frameNumber = ('' + i).padStart(3, '0');
        result.push(`https://cdn1.360-javascriptviewer.com/images/blue-shoe-small/20180906-${frameNumber}-blauw.jpg`)
    }

    // return result.reverse();
    return result;
}

export const clamp = (number, min, max) => {
  return Math.min(Math.max(number, min), max);
}

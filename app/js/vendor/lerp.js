// basic LERP function
function lerp(currentPosition, targetPosition, factor = 0.2) {
    return currentPosition + (targetPosition - currentPosition) * factor;
}
export default lerp;
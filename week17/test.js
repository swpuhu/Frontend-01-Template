function reverse (int) {
    if (int < 10) return int.toString();
    let tail = (int % 10).toString();
    let remain = Math.floor(int / 10);
    return tail + reverse(remain)
}
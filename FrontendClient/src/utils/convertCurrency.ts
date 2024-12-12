export function convertCurrency(value: number): string {
    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(3).replace(/\.?0+$/, '') + ' tỷ';
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(3).replace(/\.?0+$/, '') + ' triệu';
    } else {
        return value.toString();
    }
}

export function formatCurrency(value: number): string {
    return value.toLocaleString("vi-VN");
  }
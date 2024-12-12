 export function formatRelativeDate(dateString: string): string {
    const currentDate = new Date();
    const givenDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - givenDate.getTime();
    
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) {
      return "Hôm nay";
    } else if (daysDifference === 1) {
      return "1 ngày trước";
    } else {
      return `${daysDifference} ngày trước`;
    }
  }  
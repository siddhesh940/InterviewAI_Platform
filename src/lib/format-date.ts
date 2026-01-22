/**
 * Date Formatting Utility for Resume Builder
 * Converts YYYY-MM format to readable format
 */

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) {return '';}
  
  try {
    // Handle "Present" or empty
    if (dateString.toLowerCase() === 'present' || dateString === '') {
      return 'Present';
    }

    // Parse YYYY-MM format
    const [year, month] = dateString.split('-');
    
    if (!year) {return dateString;}
    
    if (!month) {return year;}

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`;
    }

    return dateString;
  } catch {
    return dateString || '';
  }
}

export function formatDateRange(start: string | undefined, end: string | undefined): string {
  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end) || 'Present';
  
  if (!startFormatted && !endFormatted) {return '';}
  if (!startFormatted) {return endFormatted;}
  
  return `${startFormatted} – ${endFormatted}`;
}

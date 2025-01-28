export const useReadingTime = () => {
  const calculateReadingTime = (content: any): string => {
    const words = JSON.stringify(content).split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return {
    calculateReadingTime
  };
}; 
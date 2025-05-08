export default function groupMessagesByFormattedDate(messages) {
    const dateFormatter = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  
    return messages.reduce((acc, message) => {
      const date = dateFormatter.format(new Date(message.createdAt));
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  }
  
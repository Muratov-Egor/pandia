export const getTicketInfo = (url: string) => {
  //получаем строку вида MOW0101LED03011
  const flightString = url.match(/search\/(.*?)\?/)[1]

  //из полученной строки извлекаем нужны данные
  const [origin, startDate, destination, endDate] = [
    flightString.slice(0, 3), //первые 3 символа это иата origin
    flightString.slice(3, 7), //4-7 символы это дата вылета
    flightString.slice(7, 10), //8-10 символы иата destination
    flightString.slice(10, 14), //11-14 символы это дата обратно
  ];

  const currentYear = new Date().getFullYear() //нам нужен текущий год чтобы сформировать дату

  return {
    origin,
    startDate: new Date(`${currentYear}-${startDate.slice(2)}-${startDate.slice(0, 2)}`), //первые 2 символа день, вторые месяц
    destination,
    endDate: new Date(`${currentYear}-${endDate.slice(2)}-${endDate.slice(0, 2)}`), //первые 2 символа день, вторые месяц
  }
}

export function getDateToday() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  const date = `D${String(dd)}-${String(mm)}-${String(yyyy)}`;
  // return 'D27-08-2022';
  return date;
}

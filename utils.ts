export const formatCurrency = (value: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatDate = (dateString: string, language: 'en' | 'fa' = 'en'): string => {
  const locale = language === 'fa' ? 'fa-IR' : 'en-US';
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
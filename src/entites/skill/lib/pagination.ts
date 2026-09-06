export const CARDS_PER_PAGE = 20;

export const paginate = <T>(items: T[], page: number): T[] => {
  const start = (page - 1) * CARDS_PER_PAGE;
  return items.slice(start, start + CARDS_PER_PAGE);
};

export const getTotalPages = (itemsCount: number): number =>
  Math.max(1, Math.ceil(itemsCount / CARDS_PER_PAGE));

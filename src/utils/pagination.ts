export function pagination<T>(data: T[], page: number, limit: number) {
  const lastPage = Math.ceil(data.length / limit);

  if (page > lastPage) {
    page = lastPage;
  }

  const startIndex = (page - 1) * limit;
  const paginatedData = data.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    page,
    total: data.length,
    lastPage,
  };
}

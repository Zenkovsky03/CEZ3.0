namespace CEZ3._0.Application.Helpers;

public class PagedResult<T>
{
    public PagedResult(List<T> items, int totalItemCount, int pageSize, int PageNumber)
    {
        Items = items;
        TotalItemCount = totalItemCount;
        TotalPage = (int)Math.Ceiling(totalItemCount / (double)pageSize);
        ItemFrom = (pageSize * (PageNumber - 1)) + 1;
        ItemTo = ItemFrom + pageSize - 1;
    }

    public List<T> Items { get; set; } = new List<T>();
    public int TotalPage { get; set; }
    public int TotalItemCount { get; set; }
    public int ItemFrom { get; set; }
    public int ItemTo { get; set; }
}

namespace CEZ3._0.Domain.Repositories;

public interface IThreadRepository
{
    Task<string> AddThreadAsync(Entities.Forum.Thread thread);
}

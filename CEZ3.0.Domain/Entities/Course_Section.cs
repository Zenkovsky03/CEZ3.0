namespace CEZ3._0.Domain.Entities;

public class Course_Section
{
    public int id { get; set; }
    public int course_id { get; set; }
    public Course Course { get; set; } = default!;
    public string title { get; set; } = default!;
    public int order_index { get; set; }
    public long created_at { get; set; }
    public Section_Material Section_Material { get; set; } = default!;
    public Task Task { get; set; } = default!;
}

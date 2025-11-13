namespace CEZ3._0.Domain.Entities;

public class Section_Material
{
    public int id { get; set; }
    public int section_id { get; set; }
    public Course_Section Section { get; set; } = default!;
    public string title { get; set; } = default!;
    public string content { get; set; } = default!;
    public string material_type { get; set; } = default!;
    public long created_at { get; set; }
}

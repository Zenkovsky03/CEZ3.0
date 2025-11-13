namespace CEZ3._0.Domain.Entities;

public class Course_Enrollment
{
    //primary key (course,user)
    //public int id { get; set; }
    public int course_id { get; set; }
    public Course Course { get; set; } = default!;
    public int user_id { get; set; }
    public User User { get; set; } = default!;
    public long enrollment_date { get; set; }
    public bool is_active { get; set; }

}

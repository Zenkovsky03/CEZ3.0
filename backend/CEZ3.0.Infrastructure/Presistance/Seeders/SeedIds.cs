using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// All ObjectIds are exactly 24 hex characters — the only valid ObjectId length.
/// </summary>
public static class SeedIds
{
    // ── Users ──────────────────────────────────────────────────────────
    public static readonly ObjectId Admin    = new("aaaaaaaaaaaaaaaaaaaaaaaa"); // 24 ✓
    public static readonly ObjectId Teacher1 = new("bbbbbbbbbbbbbbbbbbbbbb01"); // 24 ✓
    public static readonly ObjectId Teacher2 = new("bbbbbbbbbbbbbbbbbbbbbb02"); // 24 ✓
    public static readonly ObjectId Student1 = new("cccccccccccccccccccccc01"); // 24 ✓
    public static readonly ObjectId Student2 = new("cccccccccccccccccccccc02"); // 24 ✓
    public static readonly ObjectId Student3 = new("cccccccccccccccccccccc03"); // 24 ✓
    public static readonly ObjectId Student4 = new("cccccccccccccccccccccc04"); // 24 ✓
    public static readonly ObjectId Student5 = new("cccccccccccccccccccccc05"); // 24 ✓

    // ── Courses ────────────────────────────────────────────────────────
    public static readonly ObjectId Course1 = new("dd000000000000000000aa01"); // 24 ✓
    public static readonly ObjectId Course2 = new("dd000000000000000000aa02"); // 24 ✓

    // ── CourseSections ─────────────────────────────────────────────────
    public static readonly ObjectId Section1Course1 = new("ee000000000000000000bb01"); // 24 ✓
    public static readonly ObjectId Section2Course1 = new("ee000000000000000000bb02"); // 24 ✓
    public static readonly ObjectId Section1Course2 = new("ee000000000000000000bb03"); // 24 ✓

    // ── SectionMaterials ───────────────────────────────────────────────
    public static readonly ObjectId Material1 = new("ff000000000000000000cc01"); // 24 ✓
    public static readonly ObjectId Material2 = new("ff000000000000000000cc02"); // 24 ✓
    public static readonly ObjectId Material3 = new("ff000000000000000000cc03"); // 24 ✓

    // ── Assignments ────────────────────────────────────────────────────
    public static readonly ObjectId Assignment1 = new("a1000000000000000000dd01"); // 24 ✓
    public static readonly ObjectId Assignment2 = new("a1000000000000000000dd02"); // 24 ✓

    // ── Attempts ───────────────────────────────────────────────────────
    public static readonly ObjectId Attempt1 = new("a2000000000000000000ee01"); // 24 ✓
    public static readonly ObjectId Attempt2 = new("a2000000000000000000ee02"); // 24 ✓

    // ── Grades ─────────────────────────────────────────────────────────
    public static readonly ObjectId Grade1 = new("a3000000000000000000ff01"); // 24 ✓
    public static readonly ObjectId Grade2 = new("a3000000000000000000ff02"); // 24 ✓

    // ── Announcements ──────────────────────────────────────────────────
    public static readonly ObjectId Announcement1 = new("a4000000000000000000ab01"); // 24 ✓
    public static readonly ObjectId Announcement2 = new("a4000000000000000000ab02"); // 24 ✓

    // ── Events ─────────────────────────────────────────────────────────
    public static readonly ObjectId Event1 = new("a5000000000000000000ac01"); // 24 ✓
    public static readonly ObjectId Event2 = new("a5000000000000000000ac02"); // 24 ✓

    // ── Conversations ──────────────────────────────────────────────────
    public static readonly ObjectId Conversation1 = new("a6000000000000000000ad01"); // 24 ✓
    public static readonly ObjectId Conversation2 = new("a6000000000000000000ad02"); // 24 ✓
}
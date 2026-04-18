using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// All ObjectIds are exactly 24 hex characters.
/// </summary>
public static class SeedIds
{
    // ── Users ──────────────────────────────────────────────────────────
    public static readonly ObjectId Admin    = new("aaaaaaaaaaaaaaaaaaaaaaaa");
    public static readonly ObjectId Teacher1 = new("bbbbbbbbbbbbbbbbbbbbbb01");
    public static readonly ObjectId Teacher2 = new("bbbbbbbbbbbbbbbbbbbbbb02");
    public static readonly ObjectId Teacher3 = new("bbbbbbbbbbbbbbbbbbbbbb03");
    public static readonly ObjectId Student1 = new("cccccccccccccccccccccc01");
    public static readonly ObjectId Student2 = new("cccccccccccccccccccccc02");
    public static readonly ObjectId Student3 = new("cccccccccccccccccccccc03");
    public static readonly ObjectId Student4 = new("cccccccccccccccccccccc04");
    public static readonly ObjectId Student5 = new("cccccccccccccccccccccc05");
    public static readonly ObjectId Student6 = new("cccccccccccccccccccccc06");
    public static readonly ObjectId Student7 = new("cccccccccccccccccccccc07");
    public static readonly ObjectId Student8 = new("cccccccccccccccccccccc08");
    public static readonly ObjectId Student9 = new("cccccccccccccccccccccc09");
    public static readonly ObjectId Student10 = new("cccccccccccccccccccccc0a");

    // ── Courses ────────────────────────────────────────────────────────
    public static readonly ObjectId Course1 = new("dd000000000000000000aa01");
    public static readonly ObjectId Course2 = new("dd000000000000000000aa02");
    public static readonly ObjectId Course3 = new("dd000000000000000000aa03");
    public static readonly ObjectId Course4 = new("dd000000000000000000aa04");

    // ── CourseSections ─────────────────────────────────────────────────
    public static readonly ObjectId Section1Course1 = new("ee000000000000000000bb01");
    public static readonly ObjectId Section2Course1 = new("ee000000000000000000bb02");
    public static readonly ObjectId Section3Course1 = new("ee000000000000000000bb03");
    public static readonly ObjectId Section1Course2 = new("ee000000000000000000bb04");
    public static readonly ObjectId Section2Course2 = new("ee000000000000000000bb05");
    public static readonly ObjectId Section1Course3 = new("ee000000000000000000bb06");
    public static readonly ObjectId Section2Course3 = new("ee000000000000000000bb07");
    public static readonly ObjectId Section1Course4 = new("ee000000000000000000bb08");

    // ── SectionMaterials ───────────────────────────────────────────────
    public static readonly ObjectId Material1  = new("ff000000000000000000cc01");
    public static readonly ObjectId Material2  = new("ff000000000000000000cc02");
    public static readonly ObjectId Material3  = new("ff000000000000000000cc03");
    public static readonly ObjectId Material4  = new("ff000000000000000000cc04");
    public static readonly ObjectId Material5  = new("ff000000000000000000cc05");
    public static readonly ObjectId Material6  = new("ff000000000000000000cc06");
    public static readonly ObjectId Material7  = new("ff000000000000000000cc07");
    public static readonly ObjectId Material8  = new("ff000000000000000000cc08");

    // ── LessonAttachments ─────────────────────────────────────────────
    public static readonly ObjectId Attachment1 = new("fa000000000000000000dd01");
    public static readonly ObjectId Attachment2 = new("fa000000000000000000dd02");
    public static readonly ObjectId Attachment3 = new("fa000000000000000000dd03");
    public static readonly ObjectId Attachment4 = new("fa000000000000000000dd04");
    public static readonly ObjectId Attachment5 = new("fa000000000000000000dd05");

    // ── Assignments ────────────────────────────────────────────────────
    public static readonly ObjectId Assignment1 = new("a1000000000000000000dd01");
    public static readonly ObjectId Assignment2 = new("a1000000000000000000dd02");
    public static readonly ObjectId Assignment3 = new("a1000000000000000000dd03");
    public static readonly ObjectId Assignment4 = new("a1000000000000000000dd04");
    public static readonly ObjectId Assignment5 = new("a1000000000000000000dd05");

    // ── Attempts ───────────────────────────────────────────────────────
    public static readonly ObjectId Attempt1 = new("a2000000000000000000ee01");
    public static readonly ObjectId Attempt2 = new("a2000000000000000000ee02");
    public static readonly ObjectId Attempt3 = new("a2000000000000000000ee03");
    public static readonly ObjectId Attempt4 = new("a2000000000000000000ee04");
    public static readonly ObjectId Attempt5 = new("a2000000000000000000ee05");
    public static readonly ObjectId Attempt6 = new("a2000000000000000000ee06");
    public static readonly ObjectId Attempt7 = new("a2000000000000000000ee07");
    public static readonly ObjectId Attempt8 = new("a2000000000000000000ee08");

    // ── Grades ─────────────────────────────────────────────────────────
    public static readonly ObjectId Grade1 = new("a3000000000000000000ff01");
    public static readonly ObjectId Grade2 = new("a3000000000000000000ff02");
    public static readonly ObjectId Grade3 = new("a3000000000000000000ff03");
    public static readonly ObjectId Grade4 = new("a3000000000000000000ff04");
    public static readonly ObjectId Grade5 = new("a3000000000000000000ff05");
    public static readonly ObjectId Grade6 = new("a3000000000000000000ff06");
    public static readonly ObjectId Grade7 = new("a3000000000000000000ff07");
    public static readonly ObjectId Grade8 = new("a3000000000000000000ff08");

    // ── Announcements ──────────────────────────────────────────────────
    public static readonly ObjectId Announcement1 = new("a4000000000000000000ab01");
    public static readonly ObjectId Announcement2 = new("a4000000000000000000ab02");
    public static readonly ObjectId Announcement3 = new("a4000000000000000000ab03");
    public static readonly ObjectId Announcement4 = new("a4000000000000000000ab04");

    // ── Events ─────────────────────────────────────────────────────────
    public static readonly ObjectId Event1 = new("a5000000000000000000ac01");
    public static readonly ObjectId Event2 = new("a5000000000000000000ac02");
    public static readonly ObjectId Event3 = new("a5000000000000000000ac03");
    public static readonly ObjectId Event4 = new("a5000000000000000000ac04");

    // ── Conversations ──────────────────────────────────────────────────
    public static readonly ObjectId Conversation1 = new("a6000000000000000000ad01");
    public static readonly ObjectId Conversation2 = new("a6000000000000000000ad02");
    public static readonly ObjectId Conversation3 = new("a6000000000000000000ad03");
    public static readonly ObjectId Conversation4 = new("a6000000000000000000ad04");
    public static readonly ObjectId Conversation5 = new("a6000000000000000000ad05");

    // ── Quiz Question IDs ─────────────────────────────────────────────
    public static readonly ObjectId Q1_1 = new("b1000000000000000000aa01");
    public static readonly ObjectId Q1_2 = new("b1000000000000000000aa02");
    public static readonly ObjectId Q2_1 = new("b1000000000000000000aa03");
    public static readonly ObjectId Q3_1 = new("b1000000000000000000aa04");
    public static readonly ObjectId Q3_2 = new("b1000000000000000000aa05");
    public static readonly ObjectId Q3_3 = new("b1000000000000000000aa06");
    public static readonly ObjectId Q4_1 = new("b1000000000000000000aa07");
    public static readonly ObjectId Q4_2 = new("b1000000000000000000aa08");
    public static readonly ObjectId Q5_1 = new("b1000000000000000000aa09");
    public static readonly ObjectId Q5_2 = new("b1000000000000000000aa0a");

    // ── Extra answer IDs for Assignment 5
    public static readonly ObjectId A5_Q1_1 = new("b2000000000000000000ee01");
    public static readonly ObjectId A5_Q1_2 = new("b2000000000000000000ee02");
    public static readonly ObjectId A5_Q1_3 = new("b2000000000000000000ee03");
    public static readonly ObjectId A5_Q2_1 = new("b2000000000000000000ee04");
    public static readonly ObjectId A5_Q2_2 = new("b2000000000000000000ee05");
    public static readonly ObjectId A5_Q2_3 = new("b2000000000000000000ee06");

    // ── Quiz Answer IDs ───────────────────────────────────────────────
    // Assignment 1 answers
    public static readonly ObjectId A1_Q1_1 = new("b2000000000000000000bb01"); // wrong
    public static readonly ObjectId A1_Q1_2 = new("b2000000000000000000bb02"); // correct
    public static readonly ObjectId A1_Q1_3 = new("b2000000000000000000bb03");
    public static readonly ObjectId A1_Q1_4 = new("b2000000000000000000bb04");
    public static readonly ObjectId A1_Q2_1 = new("b2000000000000000000bb05"); // correct
    public static readonly ObjectId A1_Q2_2 = new("b2000000000000000000bb06");
    public static readonly ObjectId A1_Q2_3 = new("b2000000000000000000bb07"); // correct
    public static readonly ObjectId A1_Q2_4 = new("b2000000000000000000bb08");
    // Assignment 3 answers
    public static readonly ObjectId A3_Q1_1 = new("b2000000000000000000cc01"); // correct
    public static readonly ObjectId A3_Q1_2 = new("b2000000000000000000cc02");
    public static readonly ObjectId A3_Q1_3 = new("b2000000000000000000cc03");
    public static readonly ObjectId A3_Q2_1 = new("b2000000000000000000cc04");
    public static readonly ObjectId A3_Q2_2 = new("b2000000000000000000cc05"); // correct
    public static readonly ObjectId A3_Q2_3 = new("b2000000000000000000cc06");
    public static readonly ObjectId A3_Q3_1 = new("b2000000000000000000cc07"); // correct
    public static readonly ObjectId A3_Q3_2 = new("b2000000000000000000cc08");
    public static readonly ObjectId A3_Q3_3 = new("b2000000000000000000cc09");
    // Assignment 4 answers
    public static readonly ObjectId A4_Q1_1 = new("b2000000000000000000dd01"); // correct
    public static readonly ObjectId A4_Q1_2 = new("b2000000000000000000dd02");
    public static readonly ObjectId A4_Q1_3 = new("b2000000000000000000dd03");
    public static readonly ObjectId A4_Q2_1 = new("b2000000000000000000dd04");
    public static readonly ObjectId A4_Q2_2 = new("b2000000000000000000dd05"); // correct
    public static readonly ObjectId A4_Q2_3 = new("b2000000000000000000dd06");
}
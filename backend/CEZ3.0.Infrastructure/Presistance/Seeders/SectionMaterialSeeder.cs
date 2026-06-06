using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class SectionMaterialSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<SectionMaterialSeeder> _logger;

    public int Order => 5;

    public SectionMaterialSeeder(CezDbContext db, ILogger<SectionMaterialSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        _db.ChangeTracker.Clear();
        var now = DateTime.UtcNow;

        var allDesired = new Dictionary<ObjectId, SectionMaterial>
        {
            // ── Course 1 — Mathematics ──
            [SeedIds.Material1] = new() { Id = SeedIds.Material1, SectionId = SeedIds.Section1Course1, Section = null!, Title = "Variables and Expressions",          Content = "A variable is a symbol representing an unknown quantity. In algebra we use letters such as x, y, z to denote variables.",                                            MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material2] = new() { Id = SeedIds.Material2, SectionId = SeedIds.Section1Course1, Section = null!, Title = "Solving Linear Equations",           Content = "A linear equation is an equation of degree one. To solve it, isolate the variable on one side using inverse operations.",                                           MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material3] = new() { Id = SeedIds.Material3, SectionId = SeedIds.Section2Course1, Section = null!, Title = "Points, Lines and Planes",           Content = "Euclidean geometry begins with three undefined notions: point, line and plane. All geometric figures are built from these primitives.",                             MaterialType = "Lesson",   CreatedAt = now },

            // ── Course 2 — Polish Literature ──
            [SeedIds.Material4] = new() { Id = SeedIds.Material4, SectionId = SeedIds.Section1Course2, Section = null!, Title = "Adam Mickiewicz — Life and Works",   Content = "Adam Mickiewicz (1798–1855) is considered the greatest Polish Romantic poet. His major works include Pan Tadeusz, Dziady, and Konrad Wallenrod.",            MaterialType = "Document", CreatedAt = now },
            [SeedIds.Material5] = new() { Id = SeedIds.Material5, SectionId = SeedIds.Section2Course2, Section = null!, Title = "Positivism in Poland",               Content = "Polish Positivism followed the January Uprising of 1863. Writers such as Bolesław Prus and Eliza Orzeszkowa promoted work and social progress.",              MaterialType = "Document", CreatedAt = now },

            // ── Course 3 — Computer Science ──
            [SeedIds.Material6] = new() { Id = SeedIds.Material6, SectionId = SeedIds.Section1Course3, Section = null!, Title = "Introduction to C# Syntax",          Content = "C# is a strongly typed, object-oriented language. Every statement ends with a semicolon. Types must be declared explicitly or use the var keyword.",            MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material7] = new() { Id = SeedIds.Material7, SectionId = SeedIds.Section2Course3, Section = null!, Title = "Classes and Objects",                Content = "A class is a blueprint for objects. It defines properties (data) and methods (behaviour). An object is an instance of a class created with the new keyword.",   MaterialType = "Lesson",   CreatedAt = now },

            // ── Course 4 — English ──
            [SeedIds.Material8]  = new() { Id = SeedIds.Material8,  SectionId = SeedIds.Section1Course4, Section = null!, Title = "Structure of an Academic Essay",     Content = "An academic essay has three parts: introduction, body paragraphs and conclusion. Each body paragraph should have a clear topic sentence and supporting evidence.", MaterialType = "Document", CreatedAt = now },
            [SeedIds.Material9]  = new() { Id = SeedIds.Material9,  SectionId = SeedIds.Section2Course4, Section = null!, Title = "Finding Academic Sources",           Content = "Academic sources include peer-reviewed journals, books, and reputable websites. Use library databases and Google Scholar to find credible sources for your research.",  MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material10] = new() { Id = SeedIds.Material10, SectionId = SeedIds.Section3Course4, Section = null!, Title = "Building an Argument",              Content = "A strong argument includes a clear claim, supporting evidence, and counter-argument rebuttal. Use the Toulmin model to structure persuasive writing.",               MaterialType = "Lesson",   CreatedAt = now },

            // ── Course 5 — Physics (Fizyka klasyczna) ──
            [SeedIds.Material11] = new() { Id = SeedIds.Material11, SectionId = SeedIds.Section1Course5, Section = null!, Title = "Zasady dynamiki Newtona",           Content = "Pierwsza zasada: ciało pozostaje w spoczynku lub ruchu jednostajnym, jeśli nie działa na nie siła. Druga zasada: F = ma. Trzecia zasada: akcja = reakcja.",         MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material12] = new() { Id = SeedIds.Material12, SectionId = SeedIds.Section1Course5, Section = null!, Title = "Ruch jednostajny i przyspieszony",   Content = "Ruch jednostajny: s = vt. Ruch jednostajnie przyspieszony: s = v₀t + ½at². Przykłady: spadek swobodny, ruch po równi pochyłej.",                                 MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material13] = new() { Id = SeedIds.Material13, SectionId = SeedIds.Section2Course5, Section = null!, Title = "Podstawy termodynamiki",            Content = "Zerowa zasada: równowaga termiczna. Pierwsza zasada: ΔU = Q + W. Druga zasada: entropia układu izolowanego nigdy nie maleje.",                                        MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material14] = new() { Id = SeedIds.Material14, SectionId = SeedIds.Section2Course5, Section = null!, Title = "Przemiany gazowe",                  Content = "Przemiana izotermiczna: pV = const. Izobaryczna: V/T = const. Izochoryczna: p/T = const. Równanie Clapeyrona: pV = nRT.",                                            MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material15] = new() { Id = SeedIds.Material15, SectionId = SeedIds.Section3Course5, Section = null!, Title = "Odbicie i załamanie światła",       Content = "Prawo odbicia: kąt padania = kąt odbicia. Prawo Snella: n₁sinθ₁ = n₂sinθ₂. Całkowite wewnętrzne odbicie występuje przy przejściu z ośrodka gęstszego do rzadszego.", MaterialType = "Lesson", CreatedAt = now },

            // ── Course 6 — Biology (Biologia ogólna) ──
            [SeedIds.Material16] = new() { Id = SeedIds.Material16, SectionId = SeedIds.Section1Course6, Section = null!, Title = "Budowa komórki eukariotycznej",     Content = "Komórka eukariotyczna zawiera jądro, mitochondrium, retikulum endoplazmatyczne, aparat Golgiego oraz lizosomy. Błona komórkowa zbudowana jest z dwuwarstwy lipidowej.", MaterialType = "Lesson", CreatedAt = now },
            [SeedIds.Material17] = new() { Id = SeedIds.Material17, SectionId = SeedIds.Section1Course6, Section = null!, Title = "Podziały komórkowe",               Content = "Mitozą dzielą się komórki somatyczne (profaza, metafaza, anafaza, telofaza). Mejoza prowadzi do powstania gamet o połowie liczby chromosomów.",                    MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material18] = new() { Id = SeedIds.Material18, SectionId = SeedIds.Section2Course6, Section = null!, Title = "Podstawy dziedziczenia",            Content = "Prawa Mendla: prawo segregacji i prawo niezależnego dziedziczenia. Allele dominujące i recesywne. Genotyp i fenotyp. Krzyżówki dziedziczne.",                        MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material19] = new() { Id = SeedIds.Material19, SectionId = SeedIds.Section2Course6, Section = null!, Title = "Budowa i funkcja DNA",              Content = "DNA ma strukturę podwójnej helisy. Nukleotydy: adenina, tymina, cytozyna, guanina. Replikacja DNA, transkrypcja do RNA, translacja na białko.",                    MaterialType = "Lesson",   CreatedAt = now },
            [SeedIds.Material20] = new() { Id = SeedIds.Material20, SectionId = SeedIds.Section3Course6, Section = null!, Title = "Poziomy organizacji ekologicznej",  Content = "Populacja, biocenoza, ekosystem, krajobraz, biom, biosfera. Przepływ energii i krążenie materii. Łańcuchy pokarmowe i sieci troficzne.",                             MaterialType = "Lesson",   CreatedAt = now },
        };

        var existingIds = await _db.SectionMaterials.AsNoTracking().Select(m => m.Id).ToListAsync(cancellationToken);
        var toAdd = allDesired.Where(kv => !existingIds.Contains(kv.Key)).Select(kv => kv.Value).ToList();

        if (toAdd.Count == 0)
        {
            _logger.LogInformation("SectionMaterials already fully seeded — skipping.");
            return;
        }

        await _db.SectionMaterials.AddRangeAsync(toAdd, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} new section materials.", toAdd.Count);
    }
}
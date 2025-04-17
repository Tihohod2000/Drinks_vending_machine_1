using Drinks_vending_machine_1.repository;
using Microsoft.EntityFrameworkCore;

namespace Drinks_vending_machine_1.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) {}

    public DbSet<Brand> Brands { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Coin> Coins { get; set; }
    public DbSet<Tread> Treads { get; set; }
    public DbSet<BasketItem> BasketItems { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Конфигурация Brand
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(100);
        });
        
        // Конфигурация BasketItem
        modelBuilder.Entity<BasketItem>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.Property(p => p.ProductId)
                .HasColumnType("int");
            entity.Property(p => p.Quantity)
                .HasColumnType("int");
            
            entity.HasOne(p => p.Product)
                .WithMany()
                .HasForeignKey(p => p.ProductId);
        });

        // Конфигурация Product
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Price)
                .HasColumnType("decimal(18,2)");
            
            // Настройка связи с Brand
            entity.HasOne(p => p.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId);
        });
        
        modelBuilder.Entity<Coin>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Denomination)
                .HasColumnType("int");
            entity.Property(p => p.CountCoint)
                .HasColumnType("int");
        });
        
        // Сидирование данных
        modelBuilder.Entity<Brand>().HasData(
            new Brand { Id = 1, Name = "Coca-Cola" },
            new Brand { Id = 2, Name = "Pepsi" },
            new Brand { Id = 3, Name = "Fanta" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Info = "Газированный напиток", BrandId = 1, Price = 120 },
            new Product { Id = 2, Info = "Газированный напиток", BrandId = 2, Price = 125 },
            new Product { Id = 3, Info = "Газированный напиток", BrandId = 3, Price = 115 }
        );
        
        modelBuilder.Entity<Coin>().HasData(
            new Coin { Id = 1, Denomination = 1, CountCoint = 10 },
            new Coin { Id = 2, Denomination = 2, CountCoint = 10 },
            new Coin { Id = 3, Denomination = 5, CountCoint = 10 },
            new Coin { Id = 4, Denomination = 10, CountCoint = 10 }
        );
    }

    public override void Dispose()
    {
        base.Dispose();
    }

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
    }
}


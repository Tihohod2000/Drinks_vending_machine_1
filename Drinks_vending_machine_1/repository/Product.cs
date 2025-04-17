namespace Drinks_vending_machine_1.repository;

public class Product
{
    public int Id { get; set; }
    public string Info { get; set; }
    public int Price { get; set; }

    public int BrandId { get; set; }  // Внешний ключ
    public Brand Brand { get; set; }   // Навигационное свойство
}
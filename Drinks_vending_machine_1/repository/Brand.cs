namespace Drinks_vending_machine_1.repository;

public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public ICollection<Product> Products { get; set; }
}
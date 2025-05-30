namespace Drinks_vending_machine_1.repository;

public class BasketItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; }
    public int Quantity { get; set; } = 1;
}
using Drinks_vending_machine_1.Data;
using Drinks_vending_machine_1.repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Drinks_vending_machine_1.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BasketController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BasketController(ApplicationDbContext context)
    {
        _context = context;
    }

    [ResponseCache(Duration = 30)]
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        try
        {
            var products = await (
                    from p in _context.Products
                    join b in _context.Brands on p.BrandId equals b.Id into brandJoin
                    from b in brandJoin.DefaultIfEmpty()  // LEFT JOIN
                    select new 
                    {
                        Id = p.Id,
                        Info = p.Info,
                        Price = p.Price,
                        Brand = b != null ? new 
                        {
                            Id = b.Id,
                            Name = b.Name
                        } : null
                    })
                .Take(10)
                .ToListAsync();
            
            // return Ok("testtttttt");
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
    
    [HttpPost("add")]
    public async Task<IActionResult> AddToBasket([FromBody] AddToBasketRequest request)
    {
        if (request == null || request.ProductId <= 0)
            return BadRequest("Invalid product data.");

        var product = await _context.Products.FindAsync(request.ProductId);
        if (product == null)
            return NotFound("Product not found.");

        // Добавим товар в корзину
        var basketItem = new BasketItem
        {
            ProductId = request.ProductId,
            Quantity = 1
        };

        _context.BasketItems.Add(basketItem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Product added to basket" });
    }
    
    
    [HttpPost("by-ids")]
    public async Task<IActionResult> GetProductsByIds([FromBody] GetProductsByIdsRequest request)
    {
        if (request == null || request.Ids == null || !request.Ids.Any())
        {
            return BadRequest("Invalid request: IDs array is empty or null");
        }

        try
        {
            var products = await (
                    from p in _context.Products
                    where request.Ids.Contains(p.Id)
                    join b in _context.Brands on p.BrandId equals b.Id into brandJoin
                    from b in brandJoin.DefaultIfEmpty()  // LEFT JOIN
                    select new 
                    {
                        Id = p.Id,
                        Info = p.Info,
                        Price = p.Price,
                        Brand = b != null ? new 
                        {
                            Id = b.Id,
                            Name = b.Name
                        } : null
                    })
                .ToListAsync();

            if (!products.Any())
            {
                return NotFound("No products found with the provided IDs");
            }

            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
    
    [HttpGet("coin")]
    public async Task<IActionResult> GetCoins()
    {
        try
        {
            var coins = await _context.Coins
                .Select(c => new
                {
                    Id = c.Id,
                    Info = c.CountCoint,      // Название или описание
                    Price = c.Denomination    // Номинал монеты
                })
                .ToListAsync();

            if (!coins.Any())
            {
                return NotFound("No coins found.");
            }

            return Ok(coins);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
}
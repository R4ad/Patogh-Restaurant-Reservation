namespace Patogh.Application.Features.Favorites.DTOs;

public class FavoriteRestaurantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string FoodType { get; set; } = string.Empty;
    public string PriceRange { get; set; } = string.Empty;
}

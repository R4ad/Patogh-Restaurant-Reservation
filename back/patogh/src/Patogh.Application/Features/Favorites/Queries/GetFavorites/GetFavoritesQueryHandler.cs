using MediatR;
using Microsoft.EntityFrameworkCore;
using Patogh.Application.Features.Favorites.DTOs;
using Patogh.Application.Interfaces;

namespace Patogh.Application.Features.Favorites.Queries.GetFavorites;

public class GetFavoritesQueryHandler
    : IRequestHandler<GetFavoritesQuery, List<FavoriteRestaurantDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetFavoritesQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<FavoriteRestaurantDto>> Handle(
        GetFavoritesQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.UserFavorites
            .AsNoTracking()
            .Where(f => f.UserId == _currentUser.UserId && f.Restaurant.IsApproved)
            .Select(f => new FavoriteRestaurantDto
            {
                Id          = f.Restaurant.Id,
                Name        = f.Restaurant.Name,
                Description = f.Restaurant.Description,
                Location    = f.Restaurant.Location,
                FoodType    = f.Restaurant.FoodType,
                PriceRange  = f.Restaurant.PriceRange,
            })
            .ToListAsync(cancellationToken);
    }
}

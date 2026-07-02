using MediatR;
using Patogh.Application.Features.Favorites.DTOs;

namespace Patogh.Application.Features.Favorites.Queries.GetFavorites;

public record GetFavoritesQuery : IRequest<List<FavoriteRestaurantDto>>;

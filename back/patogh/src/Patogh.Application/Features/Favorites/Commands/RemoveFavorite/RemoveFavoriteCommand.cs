using MediatR;

namespace Patogh.Application.Features.Favorites.Commands.RemoveFavorite;

public record RemoveFavoriteCommand(Guid RestaurantId) : IRequest<Unit>;

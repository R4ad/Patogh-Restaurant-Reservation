using MediatR;

namespace Patogh.Application.Features.Favorites.Commands.AddFavorite;

public record AddFavoriteCommand(Guid RestaurantId) : IRequest<Unit>;

using MediatR;
using Microsoft.EntityFrameworkCore;
using Patogh.Application.Interfaces;
using Patogh.Domain.Exceptions;

namespace Patogh.Application.Features.Favorites.Commands.RemoveFavorite;

public class RemoveFavoriteCommandHandler : IRequestHandler<RemoveFavoriteCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public RemoveFavoriteCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(
        RemoveFavoriteCommand request,
        CancellationToken cancellationToken)
    {
        var favorite = await _context.UserFavorites
            .FirstOrDefaultAsync(
                f => f.UserId == _currentUser.UserId &&
                     f.RestaurantId == request.RestaurantId,
                cancellationToken);

        if (favorite is null)
            throw new NotFoundException("Favorite", request.RestaurantId);

        favorite.IsDeleted = true;
        favorite.DeletedAt = DateTime.UtcNow;
        favorite.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

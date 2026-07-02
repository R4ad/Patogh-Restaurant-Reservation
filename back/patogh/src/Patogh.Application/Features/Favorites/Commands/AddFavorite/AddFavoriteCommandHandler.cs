using MediatR;
using Microsoft.EntityFrameworkCore;
using Patogh.Application.Interfaces;
using Patogh.Domain.Entities;
using Patogh.Domain.Exceptions;

namespace Patogh.Application.Features.Favorites.Commands.AddFavorite;

public class AddFavoriteCommandHandler : IRequestHandler<AddFavoriteCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AddFavoriteCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(
        AddFavoriteCommand request,
        CancellationToken cancellationToken)
    {
        var restaurantExists = await _context.Restaurants
            .AsNoTracking()
            .AnyAsync(r => r.Id == request.RestaurantId && r.IsApproved, cancellationToken);

        if (!restaurantExists)
            throw new NotFoundException("Restaurant", request.RestaurantId);

        // Check for existing record including soft-deleted ones
        var existing = await _context.UserFavorites
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(
                f => f.UserId == _currentUser.UserId &&
                     f.RestaurantId == request.RestaurantId,
                cancellationToken);

        if (existing is not null)
        {
            if (!existing.IsDeleted)
                throw new ConflictException("این رستوران قبلاً به علاقه‌مندی‌ها اضافه شده است.");

            // Restore the soft-deleted record
            existing.IsDeleted  = false;
            existing.DeletedAt  = null;
            existing.DeletedBy  = null;
            existing.UpdatedAt  = DateTime.UtcNow;
        }
        else
        {
            await _context.UserFavorites.AddAsync(
                new UserFavorite
                {
                    UserId       = _currentUser.UserId,
                    RestaurantId = request.RestaurantId,
                },
                cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

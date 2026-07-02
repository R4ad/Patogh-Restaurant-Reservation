using MediatR;
using Microsoft.EntityFrameworkCore;
using Patogh.Application.Features.Users.DTOs;
using Patogh.Application.Interfaces;
using Patogh.Domain.Exceptions;

namespace Patogh.Application.Features.Users.Queries.GetProfile;

public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, UserProfileDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetProfileQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UserProfileDto> Handle(
        GetProfileQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var user = await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new UserProfileDto
            {
                Id            = u.Id,
                PhoneNumber   = u.PhoneNumber,
                Role          = u.Role.ToString(),
                DisplayName   = u.DisplayName,
                AvatarUrl     = u.AvatarUrl,
                MemberSince   = u.CreatedAt,
                TotalReservations = _context.Reservations
                    .Count(r => r.CustomerId == u.Id),
                FavoritesCount = _context.UserFavorites
                    .Count(f => f.UserId == u.Id),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
            throw new NotFoundException("User", userId);

        return user;
    }
}

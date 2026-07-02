using MediatR;
using Microsoft.EntityFrameworkCore;
using Patogh.Application.Features.Users.DTOs;
using Patogh.Application.Interfaces;
using Patogh.Domain.Exceptions;

namespace Patogh.Application.Features.Users.Commands.UpdateProfile;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateProfileCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UserProfileDto> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == _currentUser.UserId, cancellationToken);

        if (user is null)
            throw new NotFoundException("User", _currentUser.UserId);

        if (request.DisplayName is not null)
            user.DisplayName = request.DisplayName.Trim() == string.Empty
                ? null
                : request.DisplayName.Trim();

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return new UserProfileDto
        {
            Id                = user.Id,
            PhoneNumber       = user.PhoneNumber,
            Role              = user.Role.ToString(),
            DisplayName       = user.DisplayName,
            AvatarUrl         = user.AvatarUrl,
            MemberSince       = user.CreatedAt,
            TotalReservations = await _context.Reservations.CountAsync(r => r.CustomerId == user.Id, cancellationToken),
            FavoritesCount    = await _context.UserFavorites.CountAsync(f => f.UserId == user.Id, cancellationToken),
        };
    }
}

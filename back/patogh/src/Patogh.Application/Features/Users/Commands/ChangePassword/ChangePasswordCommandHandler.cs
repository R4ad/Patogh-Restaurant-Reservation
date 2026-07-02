using MediatR;
using Microsoft.EntityFrameworkCore;
using Patogh.Application.Interfaces;
using Patogh.Domain.Exceptions;

namespace Patogh.Application.Features.Users.Commands.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPasswordHasher _hasher;

    public ChangePasswordCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPasswordHasher hasher)
    {
        _context = context;
        _currentUser = currentUser;
        _hasher = hasher;
    }

    public async Task<Unit> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == _currentUser.UserId, cancellationToken);

        if (user is null)
            throw new NotFoundException("User", _currentUser.UserId);

        // Initial password setup (OTP-only accounts — empty PasswordHash):
        //   Allowed without supplying a current password. The JWT token
        //   proves identity since OTP was verified to obtain it.
        // Regular password change (account already has a password):
        //   Requires correct current password.
        if (!string.IsNullOrEmpty(user.PasswordHash))
        {
            if (string.IsNullOrEmpty(request.CurrentPassword))
                throw new DomainValidationException("رمز عبور فعلی الزامی است.");

            if (!_hasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
                throw new DomainValidationException("رمز عبور فعلی اشتباه است.");
        }

        if (request.NewPassword.Length < 6)
            throw new DomainValidationException("رمز عبور جدید باید حداقل ۶ کاراکتر باشد.");

        user.PasswordHash = _hasher.HashPassword(request.NewPassword);
        user.UpdatedAt    = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

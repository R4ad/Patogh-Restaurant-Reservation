using MediatR;
using Microsoft.EntityFrameworkCore;
using Patogh.Application.Interfaces;
using Patogh.Domain.Exceptions;

namespace Patogh.Application.Features.Users.Commands.UpdateAvatar;

public class UpdateAvatarCommandHandler : IRequestHandler<UpdateAvatarCommand, string>
{
    private static readonly string[] _allowed = [".jpg", ".jpeg", ".png", ".webp"];

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IFileStorageService _storage;

    public UpdateAvatarCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IFileStorageService storage)
    {
        _context = context;
        _currentUser = currentUser;
        _storage = storage;
    }

    public async Task<string> Handle(
        UpdateAvatarCommand request,
        CancellationToken cancellationToken)
    {
        var ext = Path.GetExtension(request.File.FileName).ToLowerInvariant();
        if (!_allowed.Contains(ext))
            throw new DomainValidationException("فرمت تصویر پروفایل باید jpg، jpeg، png یا webp باشد.");

        if (request.File.Length > 5 * 1024 * 1024)
            throw new DomainValidationException("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == _currentUser.UserId, cancellationToken);

        if (user is null)
            throw new NotFoundException("User", _currentUser.UserId);

        var url = await _storage.SaveAsync(
            request.File.OpenReadStream(),
            request.File.FileName,
            cancellationToken);

        user.AvatarUrl  = url;
        user.UpdatedAt  = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return url;
    }
}

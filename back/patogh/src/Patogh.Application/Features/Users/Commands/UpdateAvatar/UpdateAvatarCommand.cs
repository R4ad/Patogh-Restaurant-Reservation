using MediatR;
using Microsoft.AspNetCore.Http;

namespace Patogh.Application.Features.Users.Commands.UpdateAvatar;

public record UpdateAvatarCommand(IFormFile File) : IRequest<string>;

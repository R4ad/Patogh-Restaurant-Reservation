using MediatR;

namespace Patogh.Application.Features.Users.Commands.ChangePassword;

public record ChangePasswordCommand(
    string CurrentPassword,
    string NewPassword) : IRequest<Unit>;

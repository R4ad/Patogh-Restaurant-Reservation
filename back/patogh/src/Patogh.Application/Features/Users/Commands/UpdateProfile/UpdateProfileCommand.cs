using MediatR;
using Patogh.Application.Features.Users.DTOs;

namespace Patogh.Application.Features.Users.Commands.UpdateProfile;

public record UpdateProfileCommand(string? DisplayName) : IRequest<UserProfileDto>;

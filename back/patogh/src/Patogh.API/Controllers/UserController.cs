using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Patogh.Application.Features.Users.Commands.ChangePassword;
using Patogh.Application.Features.Users.Commands.UpdateAvatar;
using Patogh.Application.Features.Users.Commands.UpdateProfile;
using Patogh.Application.Features.Users.Queries.GetProfile;

namespace Patogh.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
[EnableRateLimiting("general")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>پروفایل کاربر جاری</summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var result = await _mediator.Send(new GetProfileQuery());
        return Ok(result);
    }

    /// <summary>بروزرسانی نام نمایشی</summary>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var result = await _mediator.Send(new UpdateProfileCommand(request.DisplayName));
        return Ok(result);
    }

    /// <summary>تغییر رمز عبور</summary>
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        await _mediator.Send(new ChangePasswordCommand(request.CurrentPassword, request.NewPassword));
        return Ok(new { message = "رمز عبور با موفقیت تغییر کرد." });
    }

    /// <summary>آپلود تصویر پروفایل</summary>
    [HttpPost("avatar")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UpdateAvatar(IFormFile file)
    {
        var url = await _mediator.Send(new UpdateAvatarCommand(file));
        return Ok(new { avatarUrl = url });
    }
}

// ── Request DTOs ────────────────────────────────────────────────────────────

public record UpdateProfileRequest(string? DisplayName);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

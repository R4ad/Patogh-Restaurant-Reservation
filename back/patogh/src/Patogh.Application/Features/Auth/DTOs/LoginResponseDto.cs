namespace Patogh.Application.Features.Auth.DTOs;

public class LoginResponseDto
{
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Long-lived token for obtaining new access tokens.
    /// Store securely (HttpOnly cookie preferred; localStorage as fallback).
    /// </summary>
    public string RefreshToken { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid UserId { get; set; }

    /// <summary>Access token expiry in minutes.</summary>
    public int ExpiresInMinutes { get; set; }

    /// <summary>
    /// True when this user has no password set yet (OTP-only account, profile incomplete).
    /// Distinct from "IsNewUser" — a returning user who skipped profile completion also gets true.
    /// Frontend should redirect such users to /complete-profile.
    /// </summary>
    public bool HasIncompleteProfile { get; set; }
}
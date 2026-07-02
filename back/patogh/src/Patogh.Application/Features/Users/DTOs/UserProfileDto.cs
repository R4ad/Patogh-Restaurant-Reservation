namespace Patogh.Application.Features.Users.DTOs;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime MemberSince { get; set; }
    public int TotalReservations { get; set; }
    public int FavoritesCount { get; set; }
}
